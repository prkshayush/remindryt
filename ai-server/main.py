from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from services.analysis import TaskAnalyzer
from services.leaderboard import LeaderboardService
from models.leaderboard import Leaderboard, Base as LeaderboardBase
from models.user import User
from uuid import UUID
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Server")

db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)
LeaderboardBase.metadata.create_all(bind=engine)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True)
    title = Column(String)
    content = Column(String)
    progress = Column(Integer)
    duedate = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    group_id = Column(Integer)
    user_id = Column(Integer)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Service running, home page"}

@app.get("/tasks")
async def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return {"tasks": [
        {
            "id": task.id,
            "title": task.title,
            "content": task.content,
            "progress": task.progress,
            "duedate": task.duedate,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
            "group_id": task.group_id,
            "user_id": task.user_id
        } for task in tasks
    ]}

analyzer = TaskAnalyzer()

@app.get("/analysis/{group_id}")
async def analyze_group_tasks(group_id: str, db: Session = Depends(get_db)):
    try:
        # Validate UUID format
        group_uuid = UUID(group_id)
        tasks = db.query(Task).filter(Task.group_id == str(group_uuid)).all()
        
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found for this group")
        
        task_list = [
            {
                "id": task.id,
                "progress": task.progress,
                "duedate": task.duedate.isoformat(),
                "created_at": task.created_at.isoformat()
            } for task in tasks
        ]
        
        analysis = analyzer.analyze_tasks(task_list)
        return analysis
        
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
leaderboard_service = LeaderboardService()

@app.get("/leaderboard/{group_id}")
async def get_group_leaderboard(group_id: str, db: Session = Depends(get_db)):
    try:
        group_uuid = UUID(group_id)
        rankings = leaderboard_service.get_leaderboard(db, str(group_uuid))
        
        if not rankings:
            raise HTTPException(status_code=404, detail="No leaderboard data found for this group")
        
        return {'leaderboard': rankings}
        
    except ValueError as ve:
        raise HTTPException(status_code=422, detail="Invalid UUID format")
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))