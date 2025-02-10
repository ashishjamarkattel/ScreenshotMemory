from fastapi import FastAPI
import uvicorn
from app.routes.auth.auth import app as auth_app
from app.routes.upload.upload import upload_router 
from app.db.database import engine
from app.models import user
from app.routes.search.search import search_router
from app.routes.spaces.spaces import spaces
from app.routes.memory.memory import memory_routes
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat.chat import chat_router
app = FastAPI()

user.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["wos_session"]
)
app.include_router(auth_app)
app.include_router(upload_router)
app.include_router(search_router)
app.include_router(spaces)
app.include_router(memory_routes)
app.include_router(chat_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        )
    