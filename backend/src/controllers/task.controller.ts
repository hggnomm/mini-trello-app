import { Request, Response } from "express";
import { getAuthenticatedUser } from "../utils/auth";
import {
  ITaskService,
  TaskParamsInput,
  TaskService,
  UpdateTaskInput,
} from "../services/task.service";
import { Task } from "../models/task.model";
import { getIo } from "../socket/socket";
import { SOCKET_EVENTS } from "../constants/socket.constant";

export type CreateTaskResponse = Pick<
  Task,
  "id" | "cardId" | "ownerId" | "title" | "description" | "status"
>;

export class TaskController {
  private taskService: ITaskService = new TaskService();

  private getTaskParams(req: Request): TaskParamsInput {
    const { boardId, cardId, taskId } = req.params;

    return {
      boardId,
      cardId,
      taskId,
    };
  }

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

      try {
        const io = getIo();
        io.to(`board:${boardId}`).emit(
          SOCKET_EVENTS.TASK_CREATED,
          responseData,
        );
      } catch (err) {
        console.error("Socket emit error:", err);
      }

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

  getBoardTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId } = req.params;
      
      getAuthenticatedUser(req);

      const tasks = await this.taskService.getAllTasksForBoard(boardId);

      const responseData = tasks.map((task) => ({
        id: task.id,
        cardId: task.cardId,
        title: task.title,
        description: task.description,
        status: task.status,
        order: task.order,
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

      const assignedMembers = task.assignedMembers || [];

      const responseData = {
        id: task.id,
        cardId: task.cardId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        assignedMembers,
      };

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: UpdateTaskInput = {
        ...this.getTaskParams(req),
        ...req.body,
      };

      const updatedTask = await this.taskService.updateTask(input);

      try {
        const io = getIo();
        io.to(`board:${input.boardId}`).emit(SOCKET_EVENTS.TASK_UPDATED, {
          id: updatedTask.id,
          cardId: updatedTask.cardId,
          task: {
            id: updatedTask.id,
            cardId: updatedTask.cardId,
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            order: updatedTask.order,
          },
        });
      } catch (err) {
        console.error("Socket emit error:", err);
      }

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

  reorderTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId } = req.params;
      const { tasks } = req.body; // Array of { id, cardId, order }

      getAuthenticatedUser(req);

      await this.taskService.reorderTasks(boardId, tasks);

      try {
        const io = getIo();
        io.to(`board:${boardId}`).emit(SOCKET_EVENTS.TASK_UPDATED, {});
      } catch (err) {
        console.error("Socket emit error:", err);
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const params = this.getTaskParams(req);

      await this.taskService.deleteTask(params);

      try {
        const io = getIo();
        io.to(`board:${params.boardId}`).emit(SOCKET_EVENTS.TASK_DELETED, {
          id: params.taskId,
          cardId: params.cardId,
        });
      } catch (err) {
        console.error("Socket emit error:", err);
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  assignMemberToTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { memberId } = req.body;

      const input = {
        ...this.getTaskParams(req),
        memberId,
      };

      const task = await this.taskService.assignMemberToTask(input);

      try {
        const io = getIo();
        io.to(`board:${input.boardId}`).emit(SOCKET_EVENTS.MEMBER_ASSIGNED, {
          taskId: task.id,
          cardId: task.cardId,
          memberId,
        });
      } catch (err) {
        console.error("Socket emit error:", err);
      }

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

  getAllMembersOfTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = this.getTaskParams(req);

      const assignedMembers = await this.taskService.getAllMembersOfTask(input);

      const responseData = assignedMembers.map((memberId) => ({
        taskId: input.taskId,
        memberId,
      }));

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

  removeMemberFromTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { memberId } = req.params;

      const input = this.getTaskParams(req);

      await this.taskService.removeMemberFromTask({
        ...input,
        memberId,
      });

      try {
        const io = getIo();
        io.to(`board:${input.boardId}`).emit(SOCKET_EVENTS.MEMBER_REMOVED, {
          taskId: input.taskId,
          cardId: input.cardId,
          memberId,
        });
      } catch (err) {
        console.error("Socket emit error:", err);
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
}
