import chromadb
from loguru import logger

from app.config.config import settings
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from app.db.database import SessionLocal
from app.models.memory import Memory
from fastapi import HTTPException

db = SessionLocal()  # Create a session
  

class ChromaClient:
    def __init__(self):
        self.base_url = f"{settings.CHROMADB_HOST}:{settings.CHROMADB_PORT}"
        # self.client = chromadb.HttpClient(
        #     host=settings.CHROMADB_HOST,
        #     port=settings.CHROMADB_PORT,
        #     settings=Settings(allow_reset=True, anonymized_telemetry=False)
        #     # database=settings.CHROMADB_DEFAULT_DATABASE,
        #     # tenant=settings.CHROMADB_DEFAULT_TENANT,
        # )  ## this is for http client we can run with chroma run --path to persistant storage
        self.client = chromadb.Client(
            settings=Settings(allow_reset=True, anonymized_telemetry=False)
        )
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=settings.EMBEDDING_MODEL
        )

    def create_collection(self, user_id) -> chromadb.Collection:
        try:
            collection = self.client.create_collection(
                name=user_id,
                embedding_function=self.embedding_function,
                metadata={"hnsw:space": "cosine"},
                get_or_create=False,
            )
            return collection
        except ValueError as e:
            logger.error(f"Collection name {user_id} is invalid. {e}")
            raise e
        except Exception as e:
            logger.error(f"Error while creating Collection: {user_id} ::: {e}")
            raise e

    def get_collection(self, user_id) -> chromadb.Collection:
        try:
            collection = self.client.get_collection(
                name=user_id,
                embedding_function=self.embedding_function,
            )
        except Exception as e:
            logger.debug(
                f"Collection {user_id} doesn't exist: {e} :: Create new collection!"
            )
            collection = self.create_collection(user_id)
            memory = db.query(Memory).filter(Memory.user_id == user_id).all()
            if not memory:
                return None
            for mem in memory:
                collection.add(
                    documents=[mem.image_description],
                    ids=[str(mem.id)],
                    metadatas={"user_id": user_id,
                               "space_id": mem.id},
                )
            return collection
        else:
            return collection

    def delete_collection(self, collection_name: str) -> bool:
        try:
            logger.info(f"Deleting Chroma Collection {collection_name}")
            _ = self.client.delete_collection(collection_name)
            return True
        except ValueError as e:
            logger.error(f"Collection {collection_name} doesn't exist!")
            raise e
        except Exception as e:
            logger.error(f"Error while deleting Collection: {e}")
            raise e
        
    def add_documents(self, user_id, description: str, id: int) -> bool:
        try:
            collection = self.get_collection(user_id)
            if not collection:
                collection = self.create_collection(user_id)
            logger.info(f"Adding documents to collection: {user_id}")
            collection.add(
                documents=[description],
                ids=[str(id)],
                metadatas={"user_id": user_id,
                           "space_id": id},
            ) ## can we add metadata here? what should it be?
            logger.info(f"Documents added to collection Successfully: {user_id}")
            return collection
        except Exception as e:
            logger.error(f"Error while adding documents to collection: {e}")
            raise e
        
        
