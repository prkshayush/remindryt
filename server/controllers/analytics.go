package controllers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/services"
)

type AnalyticsController struct {
	analyticsService *services.AnalyticsService
}

func NewAnalyticsController(analyticsService *services.AnalyticsService) *AnalyticsController {
    return &AnalyticsController{
        analyticsService: analyticsService,
    }
}

func (c *AnalyticsController) GetGroupAnalytics(ctx *fiber.Ctx) error{
	groupID := ctx.Params("id")

	analytics, err := c.analyticsService.GetGroupAnalytics(groupID)
	if err != nil{
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.JSON(analytics)
} 