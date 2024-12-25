package repository

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/prkshayush/remindryt/models"
	"gorm.io/gorm"
)

type DashBoardRepo struct {
	Db *gorm.DB
}

func DashboardRepository(db *gorm.DB) *DashBoardRepo {
	return &DashBoardRepo{Db: db}
}

func (r *DashBoardRepo) GetGroups(userID string) ([]models.Group, error) {
	var groups []models.Group
	err := r.Db.Preload("Members").Where("creator_id = ?", userID).Find(&groups).Error
	return groups, err
}

func (r *DashBoardRepo) CreateGroup(group *models.Group) error {
	// Generate IDs
	group.ID = uuid.New().String()
	group.JoinCode = uuid.New().String()[:8]

	return r.Db.Create(group).Error
}

func (r *DashBoardRepo) GetGroupByID(groupID string) (models.Group, error) {
	var group models.Group
	err := r.Db.Preload("Members").Preload("Creator").Where("id = ?", groupID).First(&group).Error
	return group, err
}

func (r *DashBoardRepo) JoinGroup(joinCode string, userID string) error {
	var group models.Group
	if err := r.Db.Where("join_code = ?", joinCode).First(&group).Error; err != nil {
		return fmt.Errorf("invalid join code")
	}

	var existingMember models.GroupMember
	err := r.Db.Where("group_id = ? AND user_id = ?", group.ID, userID).First(&existingMember).Error
	if err == nil {
		return fmt.Errorf("user already in group")
	}

	member := models.GroupMember{
		ID:       uuid.New().String(),
		GroupID:  group.ID,
		UserID:   userID,
		Role:     "member",
		JoinedAt: time.Now(),
	}

	return r.Db.Create(&member).Error
}

func (r *DashBoardRepo) GetGroupJoinCode(groupID string) (string, error) {
    var group models.Group
    err := r.Db.Select("join_code").Where("id = ?", groupID).First(&group).Error
    return group.JoinCode, err
}