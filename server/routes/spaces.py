from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List
import workos
import logging
from ..database import get_db
from ..models.space import Space as Spaces
from ..schemas.space import SpaceCreate, SpaceResponse
from ..config import cookie_password  # Make sure to import your cookie_password

# Setup logging
logger = logging.getLogger(__name__)
spaces = APIRouter()

@spaces.post("/spaces/{space_name}")
async def create_space(
    request: Request,
    space_name: str,
    db: Session = Depends(get_db),
):
    # Get and validate auth header
    auth_header = request.headers.get('Authorization')
    logger.info(f"Auth header: {auth_header}")
    
    if not auth_header or not auth_header.startswith('Bearer '):
        logger.error("No valid Authorization header")
        raise HTTPException(status_code=401, detail="No valid Authorization header")

    session_value = auth_header.split('Bearer ')[1]
    logger.info(f"Session value from header: {session_value[:10]}...")

    # Verify WorkOS session
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
   
    # Create new space
    try:  
        new_space = Spaces(
            name=space_name,
            user_id=current_user.id
        )
        db.add(new_space)
        db.commit()
        db.refresh(new_space)
    except Exception as e:
        logger.info(f"Space creation failed {e}")
        raise HTTPException(status_code=500, detail="Something went wrong while creating space")
    
    return new_space

@spaces.get("/spaces/{user_id}", response_model=List[SpaceResponse])
async def get_user_spaces(
    request: Request,
    user_id: str,
    db: Session = Depends(get_db),
):
    # Validate auth header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No valid Authorization header")

    session_value = auth_header.split('Bearer ')[1]

    # Verify WorkOS session
    try:
        session = workos.user_management.load_sealed_session(
            sealed_session=session_value,
            cookie_password=cookie_password,
        )
        auth_response = session.authenticate()
    except Exception as e:
        logger.error(f"Session verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid session")

    if not auth_response.authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")

    current_user = auth_response.user
    
    # Verify user is accessing their own spaces
    if str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these spaces"
        )
    
    spaces = db.query(Spaces).filter(Spaces.user_id == user_id).all()
    return spaces

@spaces.get("/spaces/{space_id}/memories")
async def get_space_memories(
    request: Request,
    space_id: int,
    db: Session = Depends(get_db),
):
    # Validate auth header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No valid Authorization header")

    session_value = auth_header.split('Bearer ')[1]

    # Verify WorkOS session
    try:
        session = workos.user_management.load_sealed_session(
            sealed_session=session_value,
            cookie_password=cookie_password,
        )
        auth_response = session.authenticate()
    except Exception as e:
        logger.error(f"Session verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid session")

    if not auth_response.authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")

    current_user = auth_response.user

    # Get space and verify ownership
    space = db.query(Spaces).filter(Spaces.id == space_id).first()
    if not space:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Space not found"
        )
    
    if str(space.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this space"
        )
    
    return space.memories 