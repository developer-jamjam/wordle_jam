from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

answer="CONAN"

@app.get('/answer')
def get_answer():
    return answer

app.mount("/wordle",StaticFiles(directory="static",html=True),name="static")

