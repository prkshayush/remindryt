package main

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/prkshayush/remindryt/controllers"
	"github.com/prkshayush/remindryt/models"
	"github.com/prkshayush/remindryt/repository"
	"github.com/prkshayush/remindryt/routes"
	"github.com/prkshayush/remindryt/services"
	"google.golang.org/api/option"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is not set in .env file")
	}
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	if err := models.MigrateFunc(db); err != nil {
		log.Fatalf("Error migrating group: %v\n", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not set in .env file")
	}

	// firebase auth
	opt := option.WithCredentialsFile("config/firebase-config.json")
	firebaseAuth, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatal("Failed to create firebase app")
	}

	auth, err := firebaseAuth.Auth(context.Background())
	if err != nil {
		log.Fatalf("Error in firebase client: %v\n", err)
	}

	// Create a new Fiber instance
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		},
	})

	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		log.Fatal("CLIENT_URL is not set in .env file")
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     clientURL,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowCredentials: true,
	}))

	dashRepo := repository.DashboardRepository(db)
	dashController := controllers.NewDashboardController(dashRepo)
	taskRepo := repository.TaskRepository(db)
	taskController := controllers.NewTaskController(taskRepo, dashRepo)
	analyticsService := services.NewAnalyticsService()
	analyticsController := controllers.NewAnalyticsController(analyticsService)
	leaderboardService := services.NewLeaderboardService()
	leaderboardController := controllers.NewLeaderboardController(leaderboardService)

	// routes
	routes.AuthRoutes(app, db, auth)
	routes.DashboardRoutes(app, dashController, auth)
	routes.TaskRoutes(app, taskController, auth)
	routes.AnalyticsRoutes(app, analyticsController, leaderboardController, auth)

	app.Listen(":" + port)

}
