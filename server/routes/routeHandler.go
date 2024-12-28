package routes

import (
	firebase "firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/controllers"
	"github.com/prkshayush/remindryt/middlewares"
	"gorm.io/gorm"
)

type Repository struct {
	Db *gorm.DB
}

func AuthRoutes(app *fiber.App, db *gorm.DB, auth *firebase.Client) {
	authController := controllers.NewAuthController(db, auth)

	authGroup := app.Group("/api/auth")
	authGroup.Post("/register", middlewares.AuthMiddleware(auth), authController.Register)
	authGroup.Post("/login", middlewares.AuthMiddleware(auth), authController.Login)

}

func DashboardRoutes(app *fiber.App, controller *controllers.DashController, auth *firebase.Client) {
	dashboard := app.Group("/api/dashboard", middlewares.AuthMiddleware(auth))

	dashboard.Get("/groups", controller.GetGroups)
	dashboard.Post("/groups", controller.CreateGroup)
	dashboard.Get("/groups/:id", controller.GetGroupByID)
	dashboard.Post("/groups/join", controller.JoinGroup)
}

func TaskRoutes(app *fiber.App, controller *controllers.TaskController, auth *firebase.Client) {

	tasks := app.Group("/api/dashboard/groups/:id/tasks",
		middlewares.AuthMiddleware(auth))

	tasks.Get("", controller.GetTasks)
	tasks.Post("/", controller.CreateTask)
	tasks.Patch("/:taskId", controller.UpdateTask)
	tasks.Delete("/:taskId", controller.DeleteTask)
}
