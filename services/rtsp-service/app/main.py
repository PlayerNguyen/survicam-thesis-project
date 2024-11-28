from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from routers import devices
import uvicorn
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*",
]

load_dotenv()

app = FastAPI(root_path="/devices")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main(request: Request):
    return {"status": "ok", "root_path": request.scope.get("root_path")}


app.include_router(devices.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        root_path="/devices",
        log_level="debug",
    )
