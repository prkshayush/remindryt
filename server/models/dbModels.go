package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

type User struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type GroupMember struct {
	ID       string    `gorm:"primaryKey" json:"id"`
	GroupID  string    `gorm:"not null" json:"group_id"`
	UserID   string    `gorm:"not null" json:"user_id"`
	User     User      `gorm:"foreignKey:UserID" json:"user"`
	Role     string    `gorm:"not null;default:'member'" json:"role"` // can be 'admin' or 'member'
	JoinedAt time.Time `json:"joined_at"`
}

type Group struct {
	ID          string        `gorm:"primaryKey" json:"id"`
	CreatorID   string        `gorm:"not null" json:"creator_id"`
	Creator     User          `gorm:"foreignKey:CreatorID" json:"creator"`
	Name        string        `gorm:"not null" json:"name"`
	Description string        `json:"description"`
	JoinCode    string        `gorm:"unique;not null" json:"join_code"`
	Members     []GroupMember `gorm:"foreignKey:GroupID" json:"members"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

type Task struct {
	ID        string    `gorm:"primaryKey;type:uuid" json:"id"`
	UserID    string    `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	GroupID   string    `json:"group_id"`
	Group     Group     `json:"group" gorm:"foreignKey:GroupID"`
	Title     string    `gorm:"not null" json:"title"`
	Content   string    `gorm:"not null" json:"content"`
	Progress  int       `gorm:"not null;default:0" json:"progress"`
	Duedate   time.Time `json:"duedate" gorm:"type:date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AnalyticsResponse struct {
	Metrics struct {
		TotalTasks     int     `json:"total_tasks"`
		Completed      int     `json:"completed"`
		CompletionRate float64 `json:"completion_rate"`
		Overdue        int     `json:"overdue"`
		HealthScore    float64 `json:"health_score"`
	} `json:"metrics"`
	Insights string `json:"insights"`
	Timestamp  string `json:"timestamp"`
}

type LeaderboardEntry struct {
	UserID           string  `json:"user_id"`
	Score            float64 `json:"score"`
	TasksCompleted   int     `json:"tasks_completed"`
	TotalTasks       int     `json:"total_tasks"`
	OnTimeCompletion int     `json:"on_time_completion"`
}

type LeaderboardResponse struct {
    Leaderboard []LeaderboardEntry `json:"leaderboard"`
}

func (u *User) HashPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func MigrateFunc(db *gorm.DB) error {
	err := db.AutoMigrate(&Group{}, &GroupMember{}, &Task{}, &User{})
	return err
}
