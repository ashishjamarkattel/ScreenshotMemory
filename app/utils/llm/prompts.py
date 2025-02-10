
REGENERATE_DESCRIPTION = lambda text, style: f"""You are a skilled text transformer. Your task is to rewrite a given text in a specific style.  

### **Instructions:**  
1. Take the provided **text** and rewrite it in the requested **style**.  
2. Maintain the **core meaning** while adjusting tone, vocabulary, and structure.  
3. Ensure the output feels natural and **authentically follows** the requested style.  

### **Inputs:**  
- **Original Text:** {text}  
- **Style:** {style}

Now, rewrite the following text:  
**"{text}"**  
in the **"{style}"** style."""

EXTRACT_TEXT_AND_DESCRIBE = f"""You are an expert in image analysis and OCR (Optical Character Recognition).  

### **Instructions:**  
1. **Extract** all visible text from the given image.  
2. **Preserve** formatting, punctuation, and structure as closely as possible.  
3. After extracting the text, provide a **concise description** of the image's content.  
"""

CHAT_PROMPT = lambda information, question: f"""You are a helpful assistant that can answer questions.

### **Instructions:**
1. **Answer** the question based on the provided information.
2. **Provide** a **concise** and **informative** answer.
3.If you don't know the answer, try explaining the information you have.
4. Only give the response donot add any other text.
### **Information:**
{information}

### **Question:**
{question}
"""