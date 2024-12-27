package middlewares

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/repository"
)

func GroupMembershipMiddleware(dashboardRepo *repository.DashBoardRepo) fiber.Handler {
    return func(c *fiber.Ctx) error {
        groupID := c.Params("id")
        userID := c.Locals("userID").(string)

        // get group to check membership
        group, err := dashboardRepo.GetGroupByID(groupID)
        if err != nil {
            return c.Status(http.StatusNotFound).JSON(&fiber.Map{
                "message": "Group not found",
            })
        }

        // if user is creator or member
        if group.CreatorID == userID {
            return c.Next()
        }

        for _, member := range group.Members {
            if member.UserID == userID {
                return c.Next()
            }
        }

        return c.Status(http.StatusForbidden).JSON(&fiber.Map{
            "message": "Not a member of this group",
        })
    }
}