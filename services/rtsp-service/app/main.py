from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from routers import devices
import uvicorn
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.include_router(devices.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        reload=True,
    )
