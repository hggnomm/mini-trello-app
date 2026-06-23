import { Request, Response } from "express";
import { getAuthenticatedUser } from "../utils/auth";
import {
  AssignMemberToTaskInput,
  ITaskService,
  TaskService,
  UpdateTaskInput,
} from "../services/task.service";
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

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, cardId, taskId } = req.params;

      const input: UpdateTaskInput = {
        boardId,
        cardId,
        taskId,
        ...req.body,
      };

      const updatedTask = await this.taskService.updateTask(input);

      res.status(200).json({
        id: updatedTask.id,
        cardId: updatedTask.cardId,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, cardId, taskId } = req.params;

      const input = {
        boardId,
        cardId,
        taskId,
      };

      await this.taskService.deleteTask(input);

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  assignMemberToTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, cardId, taskId } = req.params;
      const { memberId } = req.body;

      const input: AssignMemberToTaskInput = {
        boardId,
        cardId,
        taskId,
        memberId,
      };

      const task = await this.taskService.assignMemberToTask(input);

      res.status(201).json({
        taskId: task.id,
        memberId,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
}
