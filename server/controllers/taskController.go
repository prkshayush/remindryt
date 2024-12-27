package controllers

import (
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/prkshayush/remindryt/models"
	"github.com/prkshayush/remindryt/repository"
)

type TaskController struct{
	repo *repository.TaskRepo
}

func NewTaskController(r *repository.TaskRepo) *TaskController {
	return &TaskController{repo: r}
}

// task creation controller
func (c *TaskController) CreateTask(ctx *fiber.Ctx) error{
	groupID := ctx.Params("id")
    if groupID == "" {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "Group ID is required",
        })
    }

	tasks := new(models.Task)
	if err := ctx.BodyParser(tasks); err != nil{
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	user, ok := ctx.Locals("user").(*models.User)
	if !ok{
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "Unauthorized",
		})
	}

	tasks.UserID = user.ID
    tasks.GroupID = groupID
	
	if err := c.repo.CreateTask(tasks); err != nil{
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "Failed to create task",
		})
	}

	return ctx.Status(http.StatusCreated).JSON(tasks)
}

func (c *TaskController) GetTasks(ctx *fiber.Ctx) error{
	groupID := ctx.Params("id")
	if groupID == "" {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Group ID is required",
		})
	}

	user := ctx.Locals("user").(*models.User)
	if user.ID == "" {
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "Unauthorized",
		})
	}

	tasks, err := c.repo.GetTasksByGroupID(groupID)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "Failed to fetch tasks",
			"error": err.Error(),
		})
	}
	
	return ctx.Status(http.StatusOK).JSON(tasks)
}

func (c *TaskController) UpdateTask(ctx *fiber.Ctx) error{
	taskID, err := strconv.ParseUint(ctx.Params("taskId"), 10, 32)
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "Invalid task ID",
        })
    }
	userID := ctx.Locals("userID").(string)

	isCreator, err := c.repo.VerifyTaskOwnership(uint(taskID), userID)
	if err != nil {
        return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
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
    if err := c.repo.UpdateTask(uint(taskID), updates); err != nil {
        return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "message": "Failed to update task",
        })
    }

    return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Task updated successfully",
    })
}

func (c *TaskController) DeleteTask(ctx *fiber.Ctx) error {
    taskID, err := strconv.ParseUint(ctx.Params("taskId"), 10, 32)
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "Invalid task ID",
        })
    }

    userID := ctx.Locals("userID").(string)

    isCreator, err := c.repo.VerifyTaskOwnership(uint(taskID), userID)
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

    if err := c.repo.DeleteTask(uint(taskID)); err != nil {
        return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "message": "Failed to delete task",
        })
    }

    return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Task deleted successfully",
    })
}