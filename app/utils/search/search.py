from app.db.chroma import ChromaClient
from loguru import logger

CHROMA_DB = ChromaClient()

def search_space(user_id: str):
    try:
        return CHROMA_DB.get_collection(user_id)
    except Exception as e:
        logger.error(f"Collection not found: {e}")
        raise e