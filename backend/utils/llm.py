import os
import random
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def get_llm(temperature=0.3):
    # Get all environment variables starting with GROQ_API_KEY
    keys = [v for k, v in os.environ.items() if k.startswith("GROQ_API_KEY")]
    
    if not keys:
        raise ValueError("No GROQ_API_KEY found in .env. Please add GROQ_API_KEY, GROQ_API_KEY_2, etc.")
    
    # Rotate keys randomly to distribute load
    selected_key = random.choice(keys)
    
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=temperature,
        groq_api_key=selected_key
    )
