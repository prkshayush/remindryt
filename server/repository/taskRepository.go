package repository

import (
	"fmt"

	"github.com/google/uuid"
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
    task.ID = uuid.New().String()
	return r.Db.Create(task).Error
}

// GetTasksByGroupID gets all tasks for a specific group
func (r *TaskRepo) GetTasksByGroupID(groupID string) ([]models.Task, error) {
    var tasks []models.Task
    err := r.Db.Where("group_id = ?", groupID).
        Preload("User").
        Find(&tasks).Error
    if err != nil {
        return nil, fmt.Errorf("failed to fetch tasks for group_id %s: %v", groupID, err)
    }
    return tasks, nil
}


func (r *TaskRepo) UpdateTask(taskID string, updates map[string]interface{}) error {
    return r.Db.Model(&models.Task{}).
           Where("id = ?", taskID).
           Updates(updates).Error
}

func (r *TaskRepo) DeleteTask(taskID string) error {
    result := r.Db.Delete(&models.Task{}, "id = ?", taskID)
    if result.Error != nil {
        return result.Error
    }
    if result.RowsAffected == 0 {
        return fmt.Errorf("no task found with ID %s", taskID)
    }
    return nil
}


func (r *TaskRepo) VerifyTaskOwnership(taskID string, userID string) (bool, error) {
    var task models.Task
    err := r.Db.
        Where("id = ? AND user_id = ?", taskID, userID).
        First(&task).Error

    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return false, nil
        }
        return false, err
    }
    return true, nil
}
