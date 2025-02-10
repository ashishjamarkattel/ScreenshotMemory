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

search_router = APIRouter(
    tags=['SEARCH']
)

@search_router.get("/search")
def search(user_id: str, query: str):
    try:
        collection = search_space(user_id)
        if not collection:
            raise HTTPException(status_code=404, detail="Space Collection not found")
        results = collection.query(query_texts=[query], n_results=2)
        return results
    except Exception as e:
        logger.error(f"Error searching space: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@search_router.get("/user")
async def get_user(request: Request, db: Session = Depends(get_db)):
    try:
        # Get session from Authorization header
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

        # Get user info
        current_user = auth_response.user
        logger.info(f"Current user from WorkOS: {current_user.email}")

        # Get or create user in database
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            user = User(
                id=current_user.id,
                email=current_user.email,
                first_name=current_user.first_name,
                last_name=current_user.last_name
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Created new user: {user.email}")
        else:
            logger.info(f"Found existing user: {user.email}")

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in /user endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
   
@search_router.get("/memories")
async def get_spaces(request: Request , db: Session = Depends(get_db)):
    try:

        # Get session from Authorization header
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
        memory = db.query(Memory).filter(Memory.user_id == current_user.id).all()
        return [{
            "id": memory.id,
            "file_name": memory.file_name,
            "image_description": memory.image_description,
            "created_at": memory.created_at
        } for memory in memory]
    except Exception as e:
        logger.error(f"Error getting spaces: {e}")
        raise HTTPException(status_code=500, detail="Error getting spaces")
    
@search_router.get("/spaces/memories/{space_name}")
async def get_spaces(request: Request ,space_name: str, db: Session = Depends(get_db)):
    try:

        # Get session from Authorization header
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
        memory = db.query(Memory).filter(Memory.user_id == current_user.id , Memory.space_name==space_name).all()
     
        return [{
            "id": memory.id,
            "file_name": memory.file_name,
            "image_description": memory.image_description,
            "created_at": memory.created_at
        } for memory in memory]
    
    except Exception as e:
        logger.error(f"Error getting spaces: {e}")
        raise HTTPException(status_code=500, detail="Error getting spaces")

@search_router.get("/spaces/memory/{memory_id}")
async def get_memory(request: Request ,memory_id: int, db: Session = Depends(get_db)):
    try:

        # Get session from Authorization header
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
        
        spaces = db.query(Memory).filter(Memory.user_id == auth_response.user.id , Memory.id==memory_id ).first()
        return {
            "id": spaces.id,
            "file_name": spaces.file_name,
            "image_description": spaces.image_description,
            "created_at": spaces.created_at
        }
        
    except Exception as e:
        logger.error(f"Something went wrong: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong")