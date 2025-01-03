from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    progress = Column(Integer, default=0)
    duedate = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    group_id = Column(String, ForeignKey("groups.id"))
    user_id = Column(String, ForeignKey("users.id"))