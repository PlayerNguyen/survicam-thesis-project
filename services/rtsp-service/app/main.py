from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from routers import devices
import uvicorn
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

origins = [
    # "*",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:80"
]

load_dotenv()

app = FastAPI(root_path="/api/devices")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["X-Requested-With", "Content-Type"],
)


@app.get("/healthcheck")
async def main(request: Request):
    return {"status": "ok", "root_path": request.scope.get("root_path")}


app.include_router(devices.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        root_path="/api/devices",
        log_level="debug",
    )
