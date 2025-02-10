from app.utils.search.search import search_space
from fastapi import APIRouter
from fastapi import HTTPException, Request
from loguru import logger
from fastapi import Depends
import os
from workos import WorkOSClient
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.memory import Memory
from app.models.spaces import Spaces

WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")


workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIES_PASSWORD")



spaces = APIRouter(
    tags=['Spaces']
)

@spaces.post("/api/spaces/{space_name}", )
async def create_space(
    request: Request,
    space_name,
    db: Session = Depends(get_db),
):
    auth_header = request.headers.get('Authorization')
    logger.info(f"Auth header: {auth_header}")
    
    if not auth_header or not auth_header.startswith('Bearer '):
        logger.error("No valid Authorization header")
        raise HTTPException(status_code=401, detail="No valid Authorization header")

    session_value = auth_header.split('Bearer ')[1]
    logger.info(f"Session value from header: {session_value[:10]}...")

    # Load and verify session
    try:
        session = workos.user_management.load_sealed_session(
            sealed_session=session_value,
            cookie_password=cookie_password,
        )
        auth_response = session.authenticate()
        logger.info(f"Auth response authenticated: {auth_response.authenticated}")
    except Exception as e:
        logger.error(f"Session verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid session")

    if not auth_response.authenticated:
        logger.error("Session not authenticated")
        raise HTTPException(status_code=401, detail="Not authenticated")
 
    current_user = auth_response.user
   
    try:  
        new_space = Spaces(
            space_name=space_name,
            user_id=current_user.id
        )
        db.add(new_space)
        db.commit()
        db.refresh(new_space)
    except Exception as e:
        logger.info(f"SPace creation failed {e}")
        raise HTTPException(status_code=500, detail="Something went wrong while creating space")
    return new_space

@spaces.get("/spaces/{user_id}")
async def get_user_spaces(
    request: Request,
    user_id,
    db: Session = Depends(get_db),
    
):
    # auth_header = request.headers.get('Authorization')
    # logger.info(f"Auth header: {auth_header}")
    
    # if not auth_header or not auth_header.startswith('Bearer '):
    #     logger.error("No valid Authorization header")
    #     raise HTTPException(status_code=401, detail="No valid Authorization header")

    # session_value = auth_header.split('Bearer ')[1]
    # logger.info(f"Session value from header: {session_value[:10]}...")

    # # Load and verify session
    # try:
    #     session = workos.user_management.load_sealed_session(
    #         sealed_session=session_value,
    #         cookie_password=cookie_password,
    #     )
    #     auth_response = session.authenticate()
    #     logger.info(f"Auth response authenticated: {auth_response.authenticated}")
    # except Exception as e:
    #     logger.error(f"Session verification failed: {e}")
    #     raise HTTPException(status_code=401, detail="Invalid session")

    # if not auth_response.authenticated:
    #     logger.error("Session not authenticated")
    #     raise HTTPException(status_code=401, detail="Not authenticated")
 
    # current_user = auth_response.user
   
    
    spaces = db.query(Spaces).filter(Spaces.user_id == user_id).all()
    return spaces