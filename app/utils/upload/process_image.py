import os
from PIL import Image
from loguru import logger
from dotenv import load_dotenv
import google.generativeai as genai
from io import BytesIO
from app.utils.llm.prompts import EXTRACT_TEXT_AND_DESCRIBE

from app.utils.llm.geminie import Geminie

load_dotenv()

genai.configure(api_key=os.getenv("GEMINIE_API_KEY"))
gemini = Geminie()

def process_image(image_path: str):
    image = Image.open(BytesIO(image_path))
    image_desc = gemini.image_chat_completion(
        prompt=EXTRACT_TEXT_AND_DESCRIBE,
        image=image
        )
    print(image_desc)
    return image_desc








