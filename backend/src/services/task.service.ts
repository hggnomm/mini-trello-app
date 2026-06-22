import { Task } from "../models/task.model";
import { BoardRepository } from "../repositories/board.repository";
import { CardRepository } from "../repositories/card.repository";
import { TaskRepository } from "../repositories/task.repository";

export interface ITaskService {
  createTaskWithInCard(input: CreateTaskInput): Promise<Task>;
  getAllTasks(boardId: string, cardId: string): Promise<Task[]>;
}

export interface CreateTaskInput {
  cardId: string;
  boardId: string;
  ownerId: string;
  title: string;
  description?: string;
  status?: string;
}

export class TaskService implements ITaskService {
  private taskRepository = new TaskRepository();
  private cardRepository = new CardRepository();
  private boardRepository = new BoardRepository();

  async createTaskWithInCard(input: CreateTaskInput): Promise<Task> {
    const { boardId, cardId, ownerId, title, description, status } = input;

    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!title) throw new Error("Task Title cannot be null");

    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    // Check card is in the board?
    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    // Set task status is card name if not pass value status name in request
    const taskStatus = status || card.name;

    const currentTasksCount = await this.taskRepository.countByCardId(cardId);
    const taskOrder = currentTasksCount + 1;

    const dataTask: Omit<Task, "id"> = {
      cardId,
      boardId,
      ownerId,
      title,
      description: description || "",
      status: taskStatus,
      assignedMembers: [],
      githubAttachments: [],
      order: taskOrder,
    };
    return await this.taskRepository.create(dataTask);
  }

  async getAllTasks(boardId: string, cardId: string): Promise<Task[]> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const tasks = await this.taskRepository.findTasksByCardId(cardId);
    return tasks.sort((a, b) => a.order - b.order);
  }
}
