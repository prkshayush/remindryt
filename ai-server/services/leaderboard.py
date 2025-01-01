from datetime import datetime
from typing import List, Dict
from models.leaderboard import Leaderboard, Base

class LeaderboardService:
    def calculate_user_score(self, tasks: List[dict]) -> float:
        if not tasks:
            return 0.0
            
        total = len(tasks)
        completed = sum(1 for t in tasks if t['progress'] == 100)
        on_time = sum(1 for t in tasks 
                     if t['progress'] == 100 
                     and datetime.fromisoformat(t['duedate']) >= datetime.now())
                     
        completion_rate = completed / total if total > 0 else 0
        time_efficiency = on_time / total if total > 0 else 0
        
        return round((completion_rate * 0.6 + time_efficiency * 0.4) * 100, 2)

    def update_leaderboard(self, db, user_id: str, group_id: str, 
                          score: float, stats: Dict) -> Leaderboard:
        entry = db.query(Leaderboard).filter(
            Leaderboard.user_id == user_id,
            Leaderboard.group_id == group_id
        ).first()
        
        if not entry:
            entry = Leaderboard(
                user_id=user_id,
                group_id=group_id
            )
            db.add(entry)
            
        entry.score = score
        entry.tasks_completed = stats['completed']
        entry.total_tasks = stats['total']
        entry.on_time_completion = stats['on_time']
        entry.last_updated = datetime.utcnow()
        
        db.commit()
        return entry