from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from uuid import uuid4

Base = declarative_base()

class Leaderboard(Base):
    __tablename__ = "leaderboard"
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String)
    group_id = Column(String)
    score = Column(Float, default=0.0)
    tasks_completed = Column(Integer, default=0)
    total_tasks = Column(Integer, default=0)
    on_time_completion = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)