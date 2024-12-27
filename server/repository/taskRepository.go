package repository

import (
	"github.com/prkshayush/remindryt/models"
	"gorm.io/gorm"
)

type TaskRepo struct {
	Db *gorm.DB	
}

func TaskRepository(db *gorm.DB) *TaskRepo {
	return &TaskRepo{Db: db}
}

func (r *TaskRepo) CreateTask(task *models.Task) error{
	return r.Db.Create(task).Error
}

func (r *TaskRepo) GetTasks(userID string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.Db.Where("user_id = ?", userID).Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepo) GetTaskByID(taskID uint) (models.Task, error){
	var task models.Task
	err := r.Db.Where("id = ?", taskID).First(&task).Error
	return task, err
}