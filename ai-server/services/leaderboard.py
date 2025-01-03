from datetime import datetime, timedelta
from typing import List, Dict
from sqlalchemy.orm import Session
from models.leaderboard import Leaderboard
from models.user import User
from models.task import Task
from services.analysis import TaskAnalyzer

class LeaderboardService:
    def __init__(self):
        self.analysis_service = TaskAnalyzer()

    def get_leaderboard(self, db: Session, group_id: str) -> List[Dict]:
        # Check if leaderboard data exists and is within the 10-hour window
        ten_hours_ago = datetime.now() - timedelta(hours=10)
        existing_entries = db.query(Leaderboard).filter(
            Leaderboard.group_id == group_id,
            Leaderboard.last_updated >= ten_hours_ago
        ).all()

        if existing_entries:
            # Return existing data if it's within the 10-hour window
            return [
                {
                    'user_id': entry.user_id,
                    'username': entry.username,
                    'rank': entry.rank,
                    'task_completion_rate': entry.task_completion_rate
                }
                for entry in existing_entries
            ]

        # Fetch tasks and regenerate leaderboard data if outdated or doesn't exist
        tasks = db.query(Task).filter(Task.group_id == group_id).all()
        
        if not tasks:
            return []

        user_tasks = {}
        for task in tasks:
            if task.user_id not in user_tasks:
                user_tasks[task.user_id] = []
            user_tasks[task.user_id].append({
                'progress': task.progress,
                'duedate': task.duedate.isoformat()
            })
        
        rankings = []
        for user_id, tasks in user_tasks.items():
            metrics = self.analysis_service._calculate_metrics(tasks)
            completion_rate = metrics['completion_rate']
            
            user = db.query(User).filter(User.id == user_id).first()
            entry = db.query(Leaderboard).filter(
                Leaderboard.user_id == user_id,
                Leaderboard.group_id == group_id
            ).first()
            
            if not entry:
                entry = Leaderboard(
                    user_id=user_id,
                    group_id=group_id,
                    username=user.username if user else "Unknown",
                    task_completion_rate=completion_rate,
                    last_updated=datetime.now()
                )
                db.add(entry)
            else:
                entry.task_completion_rate = completion_rate
                entry.last_updated = datetime.now()
            
            db.commit()
            
            rankings.append({
                'user_id': user_id,
                'username': user.username if user else "Unknown",
                'rank': len(rankings) + 1,
                'task_completion_rate': completion_rate
            })
        
        rankings.sort(key=lambda x: x['task_completion_rate'], reverse=True)
        
        # Update ranks
        for index, ranking in enumerate(rankings):
            ranking['rank'] = index + 1
            entry = db.query(Leaderboard).filter(
                Leaderboard.user_id == ranking['user_id'],
                Leaderboard.group_id == group_id
            ).first()
            entry.rank = ranking['rank']
            db.commit()
        
        return rankings