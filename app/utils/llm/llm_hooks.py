from httpx import AsyncClient, HTTPStatusError
from loguru import logger
from openai import AsyncOpenAI, OpenAI

from app.config.config import settings


class LLMHook:
    def __init__(self) -> None:
        self.client = OpenAI(
            api_key=settings.LLM_API_KEY, base_url=settings.LLM_SERVER_URL, timeout=None
        )

    def completion(
        self,
        prompt: str,
        temperature: float = 0.3,
        model: str | None = None,
    ) -> str:

        if not model:
            model = self.client.models.list().data[0].id

        try:
            response = self.client.completions.create(
                prompt=prompt,
                model=model,
                temperature=temperature,
                max_tokens=settings.MAX_TOKENS,
            )
        except Exception as e:
            logger.error(f"Error while generating response from LLM. {e}")
            raise e

        response_text = response.choices[0].text.strip()

        return response_text

    def embeddings(self, text: str | list):
        logger.info("Creating Embeddings for text!")
        embedding_client = OpenAI(
            api_key=settings.LLM_API_KEY, base_url=settings.LLM_EMBEDDINGS_SERVER
        )
        try:
            response = embedding_client.embeddings.create(
                input=text,
                model=settings.EMBEDDING_MODEL,
            )
            json_response = response.model_dump()
            return json_response.get("data", [])

        except Exception as e:
            logger.error(f"Error while generating embeddings from LLM. {e}")
            raise e

    async def reranking(self, query: str, inputs: list) -> list:
        logger.info("Reranking contexts!")
        client = AsyncClient(timeout=None)
        payload = {
            "model": settings.RERANKER_MODEL,
            "query": query,
            "documents": inputs,
        }
        url = settings.LLM_RERANKINGS_SERVER + "rerank"
        try:
            response = await client.post(url=url, json=payload, timeout=None)
            response.raise_for_status()
        except HTTPStatusError as e:
            logger.warning(f"Error while reranking! {e}:: {response.json()}")
            return []
        except (Exception, TimeoutError) as e:
            logger.warning(f"Timeout Error while reranking: {e}")
            return []

        json_response = response.json()
        return json_response.get("results", [])


llm_hook = LLMHook()