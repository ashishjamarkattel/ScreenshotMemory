from fastapi import APIRouter
from fastapi import  Request, HTTPException, Body
from loguru import logger
from fastapi import Depends
import os
from workos import WorkOSClient
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.memory import Memory
from app.models.spaces import Spaces
from app.utils.llm.prompts import REGENERATE_DESCRIPTION
from app.utils.llm.geminie import Geminie


WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")


workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIES_PASSWORD")

memory_routes = APIRouter(
    tags=['memory']
)

geminie = Geminie()

@memory_routes.put("/spaces/memory/{memory_id}/description")
def update_description(
        request: Request,
        memory_id,
        update_desc: dict = Body(...),
        db: Session = Depends(get_db)
):
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

    user_memory = db.query(Memory).filter(Memory.user_id == current_user.id, Memory.id==memory_id).first()

    if not user_memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    user_memory.image_description = update_desc.get("description")

    db.commit()
    db.refresh(user_memory)

    return {"message": "Description updated successfully"}

@memory_routes.post("/spaces/memory/{memory_id}/regenerate")
def regenerate_description(
        request: Request,
        memory_id,
        db: Session = Depends(get_db)
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

    style = "Causal"
    current_user = auth_response.user
    
    user_memory = db.query(Memory).filter(Memory.user_id == current_user.id, Memory.id==memory_id).first()
    print(user_memory)

    if not user_memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    prompt = REGENERATE_DESCRIPTION(user_memory.image_description, style)
    response = geminie.chat_completion(prompt)
    return {"description": response}