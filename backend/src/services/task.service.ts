import { Task } from "../models/task.model";
import { BoardRepository } from "../repositories/board.repository";
import { CardRepository } from "../repositories/card.repository";
import { TaskRepository } from "../repositories/task.repository";

export interface ITaskService {
  createTaskWithInCard(input: CreateTaskInput): Promise<Task>;
  getAllTasks(boardId: string, cardId: string): Promise<Task[]>;
  getTaskById(boardId: string, cardId: string, taskId: string): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task>;
  deleteTask(input: TaskParamsInput): Promise<void>;
  assignMemberToTask(input: AssignMemberToTaskInput): Promise<Task>;
  getAllMembersOfTask(input: TaskParamsInput): Promise<string[]>;
}

export interface CreateTaskInput {
  cardId: string;
  boardId: string;
  ownerId: string;
  title: string;
  description?: string;
  status?: string;
}

export interface TaskParamsInput {
  boardId: string;
  cardId: string;
  taskId: string;
}

export interface UpdateTaskInput extends TaskParamsInput {
  title?: string;
  description?: string;
}

export interface AssignMemberToTaskInput extends TaskParamsInput {
  memberId: string;
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

  async getTaskById(
    boardId: string,
    cardId: string,
    taskId: string,
  ): Promise<Task> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!taskId) throw new Error("Task Id cannot be null");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const task = await this.taskRepository.findById(taskId);

    console.log(task);
    if (!task || task.cardId !== cardId) {
      throw new Error("Task not found");
    }
    return task;
  }

  async updateTask(input: UpdateTaskInput): Promise<Task> {
    const { boardId, cardId, taskId, ...data } = input;

    console.log(cardId)
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!taskId) throw new Error("Task Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task || task.cardId !== cardId) {
      throw new Error("Task not found");
    }

    return await this.taskRepository.update(taskId, data);
  }

  async deleteTask(input: TaskParamsInput): Promise<void> {
    const { boardId, cardId, taskId } = input;

    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!taskId) throw new Error("Task Id cannot be null");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const task = await this.taskRepository.findById(taskId);

    if (!task || task.cardId !== cardId) {
      throw new Error("Task not found");
    }

    await this.taskRepository.delete(taskId);
  }

  async assignMemberToTask(input: AssignMemberToTaskInput): Promise<Task> {
    const { boardId, cardId, taskId, memberId } = input;

    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!taskId) throw new Error("Task Id cannot be null");
    if (!memberId) throw new Error("Member Id cannot be null");

    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task || task.cardId !== cardId) {
      throw new Error("Task not found");
    }

    const isBoardOwner = board.ownerId === memberId;

    const isAcceptedMember = board.listMembers?.[memberId] === "accepted";
    
    if (!isBoardOwner && !isAcceptedMember) {
      throw new Error("Member is not in this board");
    }

    const assignedMembers = task.assignedMembers || [];
    if (assignedMembers.includes(memberId)) {
      throw new Error("Member is already assigned to this task");
    }

    return await this.taskRepository.update(taskId, {
      assignedMembers: [...assignedMembers, memberId],
    });
  }

  async getAllMembersOfTask(
    input: TaskParamsInput,
  ): Promise<string[]> {
    const { boardId, cardId, taskId } = input;

    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");
    if (!taskId) throw new Error("Task Id cannot be null");

    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Card not found");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task || task.cardId !== cardId) {
      throw new Error("Task not found");
    }

    return task.assignedMembers || [];
  }
}
