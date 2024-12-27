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
	ID        uint      `gorm:"primaryKey; autoIncrement" json:"id"`
	UserID    string    `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Title     string    `gorm:"not null" json:"title"`
	Content   string    `gorm:"not null" json:"content"`
	Progress  int       `gorm:"not null" json:"progress"`
	Duedate   time.Time `gorm:"not null" json:"duedate"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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
