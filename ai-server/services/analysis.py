from datetime import datetime, timedelta
import google.generativeai as ai
from typing import List, Dict
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

load_dotenv()

class TaskAnalyzer:
    def __init__(self):
        ai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = ai.GenerativeModel("gemini-1.5-flash")
    
    def analyze_tasks(self, tasks: List[dict]):
        metrics = self._calculate_metrics(tasks)
        insights = self._generate_insights(metrics)
        return {
            "metrics": metrics,
            "insights": insights,
            "timestamp": datetime.now()
        }
    
    def _calculate_metrics(self, tasks: List[dict]):
        total_tasks = len(tasks)
        if not total_tasks:
            return None
        
        completed = sum(1 for task in tasks if task["progress"] == 100)
        overdue = sum(1 for task in tasks if task["progress"] < 100 and datetime.fromisoformat(task["duedate"]) < datetime.now())
        return {
            "total_tasks": total_tasks,
            "completed": completed,
            "completion_rate": round((completed/total_tasks)*100, 2),
            "overdue": overdue,
            "health_score": self._calculate_health_score(tasks)
        }
    
    def _calculate_health_score(self, tasks: List[dict]) -> float:
        if not tasks:
            return 0.0
        
        scores = []
        for task in tasks:
            progress = task["progress"] / 100
            days_to_deadline = (datetime.fromisoformat(task["duedate"]) - datetime.now()).days
            time_factor = min(1.0, max(0.1, days_to_deadline / 30))
            scores.append((progress + time_factor) / 2)
            
        return round(sum(scores) / len(scores) * 100, 2)

    def _generate_insights(self, metrics: dict) -> str:
        prompt = f"""
        Task Analysis Metrics:
        - Total Tasks: {metrics['total_tasks']}
        - Completion Rate: {metrics['completion_rate']}%
        - Overdue Tasks: {metrics['overdue']}
        - Health Score: {metrics['health_score']}%

        Provide a brief, motivational insight about the task progress, personalise it, make it more than just a general message.
        """
        response = self.model.generate_content(prompt)
        return response.text