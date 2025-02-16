from fastapi import FastAPI, Request
from routers.embeddings import router as EmbeddingRouter
from routers.members import router as MembersRouter
from routers.assets import router as AssetsRouter
from v2.router import router as V2Router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

load_dotenv()


app = FastAPI(root_path="/api/faces", redirect_slashes=False)

origins = [
    # "*",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:80",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthcheck")
async def main(request: Request):
    return {"status": "ok", "root_path": request.scope.get("root_path")}


app.include_router(router=EmbeddingRouter, prefix="/embeddings", tags=["embeddings"])
app.include_router(router=MembersRouter, prefix="/members", tags=["members"])
app.include_router(router=AssetsRouter, prefix="/assets", tags=["assets"])

app.include_router(router=V2Router, prefix="/v2", tags=["v2"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT", default="80")),
        reload=True,
        root_path="/api/faces",
    )
