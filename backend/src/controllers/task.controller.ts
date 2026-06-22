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
      const { boardId, cardId } = req.params;
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

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, cardId } = req.params;

      getAuthenticatedUser(req);

      const tasks = await this.taskService.getAllTasks(boardId, cardId);

      const responseData = tasks.map((task) => ({
        id: task.id,
        cardId: task.cardId,
        title: task.title,
        description: task.description,
        status: task.status,
      }));

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, cardId, taskId } = req.params;

      getAuthenticatedUser(req);

      const task = await this.taskService.getTaskById(boardId, cardId, taskId);

      const responseData = {
        id: task.id,
        cardId: task.cardId,
        title: task.title,
        description: task.description,
        status: task.status,
      };

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
