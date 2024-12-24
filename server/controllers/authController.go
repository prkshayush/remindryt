package controllers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/models"
    firebase "firebase.google.com/go/v4/auth"
    "gorm.io/gorm"
)

type AuthController struct {
    DB   *gorm.DB
    Auth *firebase.Client
}

type RegisterInput struct {
    Email    string `json:"email" validate:"required,email"`
    Username string `json:"username" validate:"required,min=3"`
    Password string `json:"password" validate:"required,min=6"`
}

func NewAuthController(db *gorm.DB, auth *firebase.Client) *AuthController {
    return &AuthController{
        DB:   db,
        Auth: auth,
    }
}

func (ac *AuthController) Register(c *fiber.Ctx) error {
	var input RegisterInput
    if err := c.BodyParser(&input); err != nil {
        return c.Status(400).JSON(&fiber.Map{
            "status": "error",
            "message": "Invalid request body",
        })
    }

	token := c.Locals("user").(*firebase.Token)
    if token == nil {
        return c.Status(401).JSON(&fiber.Map{
            "status": "error",
            "message": "Unauthorized",
        })
    }

	var existingUser models.User
    if err := ac.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        return c.Status(409).JSON(fiber.Map{
            "status": "error",
            "message": "User already exists",
        })
    }

	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Invalid input",
		})
	}

	user := &models.User{
        ID:       token.UID,
        Email:    input.Email,
        Username: input.Username,
	}

	if err := user.HashPassword(input.Password); err != nil {
        return c.Status(500).JSON(&fiber.Map{
            "status": "error",
            "message": "Error processing password",
        })
    }
    if err := ac.DB.Create(user).Error; err != nil {
        return c.Status(500).JSON(&fiber.Map{
            "status": "error",
            "message": "Error creating user",
        })
    }

    return c.JSON(&fiber.Map{
        "status": "success",
        "data": fiber.Map{
            "user": user,
        },
    })
}

func (ac *AuthController) Login(c *fiber.Ctx) error{
    var input struct {
        Email string `json:"email"`
        Password string `json:"password"`
    }

    if err := c.BodyParser(&input); err != nil {
        return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
            "status": "error",
            "message": "Invalid input",
        })
    }

    var user models.User
    if err := ac.DB.Where("email = ?", input.Email).First(&user).Error; err != nil{
        return c.Status(http.StatusNotFound).JSON(&fiber.Map{
            "status": "error",
            "message": "User not found",
        })
    }

    c.Status(http.StatusOK).JSON(&fiber.Map{
        "status": "success",
        "data": &fiber.Map{
            "user": user,
        },
    })

    return nil
}