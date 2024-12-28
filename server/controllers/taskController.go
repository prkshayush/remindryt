package controllers

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/models"
	"github.com/prkshayush/remindryt/repository"
)

type TaskController struct {
	taskRepo *repository.TaskRepo
	dashRepo *repository.DashBoardRepo
}

func NewTaskController(r *repository.TaskRepo, dashRepo *repository.DashBoardRepo) *TaskController {
	return &TaskController{
		taskRepo: r,
		dashRepo: dashRepo,
	}
}

// task creation controller
func (c *TaskController) CreateTask(ctx *fiber.Ctx) error {
	groupID := ctx.Params("id")
	if groupID == "" {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Group ID is required",
		})
	}

	task := new(models.Task)
	if err := ctx.BodyParser(task); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	user, ok := ctx.Locals("user").(*models.User)
	if !ok {
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "Unauthorized access denied",
		})
	}

	task.UserID = user.ID
	task.GroupID = groupID

	if err := c.taskRepo.CreateTask(task); err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "Failed to create task",
			"error":   err.Error(),
		})
	}

	return ctx.Status(http.StatusCreated).JSON(task)
}

func (c *TaskController) GetTasks(ctx *fiber.Ctx) error {
	fmt.Println("Debug: Entered GetTasks handler")
	groupID := ctx.Params("id")
	fmt.Printf("Debug: Group ID from params: %s\n", groupID)

	if groupID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Group ID is required",
		})
	}

	tasks, err := c.taskRepo.GetTasksByGroupID(groupID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch tasks",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(tasks)
}

func (c *TaskController) UpdateTask(ctx *fiber.Ctx) error {
	taskID := ctx.Params("taskId")
	if taskID == "" {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Empty task ID",
		})
	}
	user, ok := ctx.Locals("user").(*models.User)
	if !ok {
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "Unauthorized access denied",
		})
	}
	userID := user.ID

	isCreator, err := c.taskRepo.VerifyTaskOwnership(taskID, userID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"message": "Error verifying task ownership",
		})
	}
	if !isCreator {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Not authorized to update this task",
		})
	}

	// parsing updated values
	updates := make(map[string]interface{})
	if err := ctx.BodyParser(&updates); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid update data",
		})
	}

	// Update task
	if err := c.taskRepo.UpdateTask(taskID, updates); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update task",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Task updated successfully",
	})
}

func (c *TaskController) DeleteTask(ctx *fiber.Ctx) error {
	taskID := ctx.Params("taskId")
	if taskID == "" {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Empty task ID",
		})
	}
	user, ok := ctx.Locals("user").(*models.User)
	if !ok {
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "Unauthorized access denied",
		})
	}
	userID := user.ID

	isCreator, err := c.taskRepo.VerifyTaskOwnership(taskID, userID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error verifying task ownership",
		})
	}
	if !isCreator {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Not authorized to delete this task",
		})
	}

	if err := c.taskRepo.DeleteTask(taskID); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to delete task",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}
