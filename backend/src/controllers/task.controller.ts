import { Request, Response } from "express";
import { getAuthenticatedUser } from "../utils/auth";
import { ITaskService, TaskService } from "../services/task.service";
import { Task } from "../models/task.model";

export type CreateTaskResponse = Pick<
  Task,
  "id" | "cardId" | "ownerId" | "title" | "description" | "status"
>;

export class TaskController {
  private taskService: ITaskService = new TaskService();

  createCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, id: cardId } = req.params;
      const { title, description, status } = req.body;

      const user = getAuthenticatedUser(req);

      const newTask = await this.taskService.createTaskWithInCard({
        boardId,
        cardId,
        ownerId: user.id,
        title,
        description,
        status,
      });

      const responseData: CreateTaskResponse = {
        id: newTask.id,
        cardId: newTask.cardId,
        ownerId: newTask.ownerId,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
      };

      res.status(201).json(responseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
