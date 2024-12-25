package controllers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/models"
	"github.com/prkshayush/remindryt/repository"
)

type DashController struct{
	repo *repository.DashBoardRepo
}

func NewDashboardController(r *repository.DashBoardRepo) *DashController {
    return &DashController{repo: r}
}

func (c *DashController) CreateGroup(ctx *fiber.Ctx) error {
    group := new(models.Group)
    if err := ctx.BodyParser(group); err != nil {
        return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
            "message": "Cannot parse JSON",
        })
    }

    // Get user from context with type assertion and error handling
    user, ok := ctx.Locals("user").(*models.User)
    if !ok {
        return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
            "message": "Unauthorized",
        })
    }
    group.CreatorID = user.ID

    if err := c.repo.CreateGroup(group); err != nil {
        return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
            "message": "Failed to create group",
        })
    }

    return ctx.Status(http.StatusCreated).JSON(&fiber.Map{
        "message": "Group created successfully",
        "data":    group,
    })
}

func (c *DashController) GetGroups(ctx *fiber.Ctx) error {
    user, ok := ctx.Locals("user").(*models.User)
    if !ok {
        return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
            "message": "Unauthorized",
        })
    }

    groups, err := c.repo.GetGroups(user.ID)
    if err != nil {
        return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
            "message": "Failed to fetch groups",
        })
    }

    return ctx.Status(http.StatusOK).JSON(&fiber.Map{
        "message": "Groups fetched successfully",
        "data":    groups,
    })
}

func (c *DashController) GetGroupByID(ctx *fiber.Ctx) error {
    id := ctx.Params("id")
    if id == "" {
        return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
            "message": "Group ID is required",
        })
    }

    group, err := c.repo.GetGroupByID(id)
    if err != nil {
        return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
            "message": "Failed to fetch group",
        })
    }

    return ctx.Status(http.StatusOK).JSON(&fiber.Map{
        "message": "Group fetched successfully",
        "data":    group,
    })
}

func (c *DashController) JoinGroup(ctx *fiber.Ctx) error {
    joinCode := ctx.FormValue("join_code")
    if joinCode == "" {
        return ctx.Status(400).JSON(fiber.Map{
            "message": "Join code is required",
        })
    }

    user := ctx.Locals("user").(*models.User)
    
    err := c.repo.JoinGroup(joinCode, user.ID)
    if err != nil {
        return ctx.Status(400).JSON(fiber.Map{
            "message": err.Error(),
        })
    }

    return ctx.Status(200).JSON(fiber.Map{
        "message": "Successfully joined group",
    })
}