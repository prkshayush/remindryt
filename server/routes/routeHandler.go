package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/controllers"
	firebase "firebase.google.com/go/v4/auth"
	"gorm.io/gorm"
	"github.com/prkshayush/remindryt/middlewares"
)

func AuthRoutes(app *fiber.App, db *gorm.DB, auth *firebase.Client){
	authController := controllers.NewAuthController(db, auth)

    authGroup := app.Group("/api/auth")
    authGroup.Post("/register", middlewares.AuthMiddleware(auth), authController.Register)
	authGroup.Post("/login", middlewares.AuthMiddleware(auth), authController.Login)

}