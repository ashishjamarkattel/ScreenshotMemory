from dotenv import load_dotenv
import os
from functools import wraps
import uvicorn
from loguru import logger
from fastapi import FastAPI, Request, Form, HTTPException, status, responses
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from workos import WorkOSClient
from fastapi.templating import Jinja2Templates
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi import Depends

load_dotenv()

app = APIRouter(
    tags=['Authentication']
)

templates = Jinja2Templates(directory="/Users/aashish/developer/project/supermemory/app/templates")
WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")


workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIES_PASSWORD")

# Decorator to check if the user is authenticated. If not, redirect to login
def with_auth(func):
    @wraps(func)
    async def decorated_function(request: Request, *args, **kwargs):
        session = workos.user_management.load_sealed_session(
            sealed_session=request.cookies.get("wos_session"),
            cookie_password=cookie_password,
        )
        auth_response =   session.authenticate()
        if auth_response.authenticated:
            return   func(request, *args, **kwargs)

        if (
            auth_response.authenticated == False
            and auth_response.reason == "no_session_cookie_provided"
        ):
            return RedirectResponse(url="http://localhost:5173/")

        # If no session, attempt a refresh
        try:
            logger.info("Refreshing session")
            result =   session.refresh()
            if result.authenticated == False:
                return RedirectResponse(url="http://localhost:5173/")

            response = RedirectResponse(url=str(request.url))
            response.set_cookie(
                "wos_session",
                result.sealed_session,
                secure=True,
                httponly=True,
                samesite="lax",
                max_age=3600  # 1 hour expiry
            )
            return response
        except Exception as e:
            logger.info("Error refreshing session", e)
            response = RedirectResponse(url="http://localhost:5173/")
            response.delete_cookie("wos_session")
            return response

    return decorated_function


# @app.get("/account")
# @with_auth
# def account(request: Request, db: Session = Depends(get_db)):
#     session = workos.user_management.load_sealed_session(
#         sealed_session=request.cookies.get("wos_session"),
#         cookie_password=cookie_password,
#     )
#     response = session.authenticate()

#     current_user = response.user if response.authenticated else None
#     current_user_id = current_user.id
#     current_user_email = current_user.email
#     current_user_first_name = current_user.first_name
#     current_user_last_name = current_user.last_name
#     ##create user in db
#     try:
#         user = User(id=current_user_id, email=current_user_email, first_name=current_user_first_name, last_name=current_user_last_name)
#         db.add(user)
#         db.commit()
#         db.refresh(user)
#     except Exception as e:
#         logger.info(f"Error creating user in db: {e}")
#         raise HTTPException(status_code=500, detail="Error creating user in db")
    
#     logger.info(f"User: {current_user.first_name} is logged in")

@app.get("/callback")
def callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    logger.info(f"Callback received with code: {code}")

    try:
        auth_response = workos.user_management.authenticate_with_code(
            code=code,
            session={"seal_session": True, "cookie_password": cookie_password},
        )

        logger.info("Successfully authenticated with WorkOS")

        # Get user info and create/update in DB
        current_user = auth_response.user
        try:
            existing_user = db.query(User).filter(User.id == current_user.id).first()
            if not existing_user:
                user = User(
                    id=current_user.id, 
                    email=current_user.email, 
                    first_name=current_user.first_name, 
                    last_name=current_user.last_name
                )
                db.add(user)
                db.commit()
                logger.info(f"Created new user: {current_user.email}")
            else:
                logger.info(f"User exists: {current_user.email}")
        except Exception as e:
            logger.error(f"Database error: {e}")

        logger.info("Redirecting it to dashboard")
        # Set cookie and redirect
        response = RedirectResponse(url="http://localhost:5173/home")
        
        # Set the session cookie with proper settings
        sealed_session = auth_response.sealed_session
        logger.info(f"Setting session cookie: {sealed_session[:10]}...")  # Log partial session for debugging
        
        response.set_cookie(
            key="wos_session",
            value =sealed_session,
            # domain="localhost", 
            httponly=False,
            secure=False,  # Set to True in production
            samesite="lax",
            path="/",
            max_age=3600  # 1 hour expiry
        )
        
        return response

    except Exception as e:
        logger.error(f"Authentication error in callback: {e}")
        return RedirectResponse(url="http://localhost:5173")

@app.get("/login")
def login():
    authorization_url = workos.user_management.get_authorization_url(
        provider="authkit", redirect_uri=os.getenv("WORKOS_REDIRECT_URI")
    )
    
    logger.info(authorization_url)
    return RedirectResponse(url=authorization_url)

@app.get("/verify-session")
async def verify_session(request: Request):
    try:
        session = workos.user_management.load_sealed_session(
            sealed_session=request.cookies.get("wos_session"),
            cookie_password=cookie_password,
        )
        auth_response = session.authenticate()
        
        if auth_response.authenticated:
            return {"authenticated": True}
        logger.info("Session not authenticated")
        return {"authenticated": False}
    except Exception as e:
        logger.error(f"Session verification error: {e}")
        return {"authenticated": False}

@app.get("/logout")
async def logout(request: Request):
    session = workos.user_management.load_sealed_session(
        sealed_session=request.cookies.get("wos_session"),
        cookie_password=cookie_password,
    )
    url =   session.get_logout_url()

    # After log out has succeeded, the user will be redirected to your app homepage which is configured in the WorkOS dashboard
    response = RedirectResponse(url=url)
    response.delete_cookie("wos_session")

    return response

if __name__ == "__main__":
    uvicorn.run(
        "auth:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        )
    

"object='user' id='user_01JJCG55J0SN553219RM996543' email='ashishjamarkattel123@gmail.com' first_name='Ashish' last_name='Jamarkattel' email_verified=True profile_picture_url='https://workoscdn.com/images/v1/B5fMRgTWcYQG4_N7PX7byvp7MRAvIZhGC6oUIdeMP0c' created_at='2025-01-24T15:51:11.135Z' updated_at='2025-01-24T15:51:11.135Z'"


## "PUT /spaces/memory/2/description HTTP/1.1" 404 Not Found  "POST /spaces/memory/2/regenerate HTTP/1.1" 404 Not Found