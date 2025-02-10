import os
from PIL import Image
from loguru import logger
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINIE_API_KEY"))

class Geminie:
    def __init__(self):
        self.client = genai.GenerativeModel(model_name="gemini-1.5-flash")

    def chat_completion(self, prompt: str):
        response = self.client.generate_content(prompt)
        return response.text
    
    def image_chat_completion(self, image: Image.Image, prompt: str):
        response = self.client.generate_content([image, prompt])
        return response.text
    
