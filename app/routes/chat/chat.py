from dotenv import load_dotenv
import os
from functools import wraps
from loguru import logger
from fastapi import FastAPI, Request, Form, HTTPException, Body
from fastapi import APIRouter
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from fastapi import Depends
from app.utils.llm.geminie import Geminie
from workos import WorkOSClient
from app.utils.llm.prompts import CHAT_PROMPT
from app.db.chroma import ChromaClient

load_dotenv()

WORKOS_CLIENT_ID = os.getenv("WORKOS_CLIENT_ID")
WORKOS_API_KEY = os.getenv("WORKOS_API_KEY")


workos = WorkOSClient(
    api_key=os.getenv("WORKOS_API_KEY"), client_id=os.getenv("WORKOS_CLIENT_ID")
)

cookie_password = os.getenv("WORKOS_COOKIES_PASSWORD")


chat_router = APIRouter(
    tags=['Chat']
)

geminie = Geminie()
chroma = ChromaClient()


@chat_router.post("/chat")
async def chat(
    request: Request,
    update_desc: dict = Body(...),
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
    
        current_user = auth_response.user
        logger.info(f"Current user from WorkOS: {current_user.email}")

        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        question = update_desc.get("message")
        information = "HEllow how are you"
        collection = chroma.get_collection(user.id)
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        results = collection.query(
            query_texts=[question],
            n_results=2
        )
        results = results["documents"][0][0] 
        prompt = CHAT_PROMPT(results, question)
        print(prompt)
        response = geminie.chat_completion(prompt)
        return {"response":response}


