from dotenv import load_dotenv
from loguru import logger
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi import APIRouter
from typing import Annotated
from fastapi import UploadFile, File
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from pathlib import Path
from workos import WorkOSClient
from app.utils.upload.process_image import process_image
from app.models.memory import Memory
from app.models.spaces import Spaces
from app.models.user import User
from app.db.chroma import ChromaClient
import os

load_dotenv()

upload_router = APIRouter(
    tags=['UPLOAD']
)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the upload directory exists

WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")


workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIES_PASSWORD")


CHROMA_DB = ChromaClient()
##api that tekes the input as image and use_id and returns the response
@upload_router.post("/upload")
async def upload_image(
    request: Request, 
    file: Annotated[UploadFile, File(...)],
    space_name: str = Form(...),
    db: Session = Depends(get_db)
    ):

    file_content = await file.read()
    ## verify the user
    # print("User id:", user_id)
    # user = db.query(User).filter(User.id == str(user_id)).first()
    # if not user:
    #     raise HTTPException(status_code=404, detail="User not found")

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
    try:
        current_user = auth_response.user
        try:
            image_desc = process_image(file_content)
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise HTTPException(status_code=500, detail="Could not process image.")
        ## save the file to the database
        memory = Memory(
            user_id=current_user.id,
            file_name=file.filename,
            space_name=space_name,
            image_description=image_desc
        )
        db.add(memory)
        db.commit()
        db.refresh(memory)

        ## add the image to the chroma db
        CHROMA_DB.add_documents(current_user.id, image_desc, memory.id)
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Something went wrong while saving the image.")
        

    return {"message": "Image uploaded successfully", "status_code": 200}


