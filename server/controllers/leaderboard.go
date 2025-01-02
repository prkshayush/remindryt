package controllers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/services"
)

type LeaderboardController struct {
	leaderboardService *services.LeaderboardService
}

func NewLeaderboardController(leaderboardService *services.LeaderboardService) *LeaderboardController{
	return &LeaderboardController{
		leaderboardService: leaderboardService,
	}
}

func (c *LeaderboardController) GetLeaderboard(ctx *fiber.Ctx) error{
	groupID := ctx.Params("id")

	leaderboard, err := c.leaderboardService.GetLeaderboard(groupID)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": err.Error(),
		})
	}

	return ctx.JSON(leaderboard)
}