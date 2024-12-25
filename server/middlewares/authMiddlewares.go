package middlewares

import (
	"context"
	"fmt"
	"strings"

	firebase "firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/models"
)

func AuthMiddleware(auth *firebase.Client) fiber.Handler {
    return func(c *fiber.Ctx) error {
        header := c.Get("Authorization")
        if header == "" {
            fmt.Println("Debug: Missing authorization header")
            return c.Status(401).JSON(&fiber.Map{
                "message": "Missing authorization header",
            })
        }

        fmt.Printf("Debug: Received header: %s\n", header)

        idToken := strings.TrimPrefix(header, "Bearer ")
        if idToken == header {
            fmt.Println("Debug: Invalid token format - Bearer prefix missing")
            return c.Status(401).JSON(&fiber.Map{
                "status": "error",
                "message": "Invalid token format",
            })
        }

        fmt.Printf("Debug: Attempting to verify token: %s\n", idToken[:10]) // first 10 chars for safety

        token, err := auth.VerifyIDToken(context.Background(), idToken)
        if err != nil {
            fmt.Printf("Debug: Token verification failed: %v\n", err)
            return c.Status(401).JSON(&fiber.Map{
                "status": "error",
                "message": fmt.Sprintf("Invalid token: %v", err),
            })
        }

        // Set full token claims in context
        c.Locals("user", &models.User{
            ID: token.UID,
            Email: token.Claims["email"].(string),
        })
        
        fmt.Printf("Debug: User set in context with ID: %s\n", token.UID)
        return c.Next()
    }
}