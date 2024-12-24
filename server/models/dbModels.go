package models

import (
	"time"
    "golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

type User struct {
    ID            string    `gorm:"primaryKey" json:"id"`
    Email         string    `gorm:"unique;not null" json:"email"`
    Username      string    `gorm:"unique;not null" json:"username"`
    Password      string    `gorm:"not null" json:"-"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}

func MigrateUser(db *gorm.DB) error {
	err := db.AutoMigrate(&User{})
	return err
}
func (u *User) HashPassword(password string) error {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.Password = string(hashedPassword)
    return nil
}