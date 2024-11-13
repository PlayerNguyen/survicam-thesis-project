from fastapi import FastAPI
from app.routers.embeddings import router as EmbeddingRouter
from app.routers.members import router as MembersRouter
from dotenv import load_dotenv
import milvus

load_dotenv()

app = FastAPI()

app.include_router(router=EmbeddingRouter, prefix="/embeddings", tags=["embeddings"])
app.include_router(router=MembersRouter, prefix="/members", tags=["members"])
