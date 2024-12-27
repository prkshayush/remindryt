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

// GetTasksByGroupID gets all tasks for a specific group
func (r *TaskRepo) GetTasksByGroupID(groupID string) ([]models.Task, error) {
    var tasks []models.Task
    err := r.Db.Preload("User").Preload("Group").Where("group_id = ?", groupID).Find(&tasks).Error
    return tasks, err
}

func (r *TaskRepo) UpdateTask(taskID uint, updates map[string]interface{}) error {
    return r.Db.Model(&models.Task{}).
           Where("id = ?", taskID).
           Updates(updates).Error
}

func (r *TaskRepo) DeleteTask(taskID uint) error {
    return r.Db.Delete(&models.Task{}, "id = ?", taskID).Error
}

func (r *TaskRepo) VerifyTaskOwnership(taskID uint, userID string) (bool, error) {
    var task models.Task
    err := r.Db.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return false, nil
        }
        return false, err
    }
    return true, nil
}