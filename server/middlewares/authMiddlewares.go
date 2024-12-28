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
            return c.Status(401).JSON(&fiber.Map{
                "message": "Missing authorization header",
            })
        }


        idToken := strings.TrimPrefix(header, "Bearer ")
        if idToken == header {
            return c.Status(401).JSON(&fiber.Map{
                "status": "error",
                "message": "Invalid token format",
            })
        }

        token, err := auth.VerifyIDToken(context.Background(), idToken)
        if err != nil {
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
        return c.Next()
    }
}