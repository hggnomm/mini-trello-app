import { CardRepository } from "../repositories/card.repository";
import { BoardRepository } from "../repositories/board.repository";
import { Card } from "../models/card.model";

export interface CreateCardInput {
  boardId: string;
  ownerId: string;
  name: string;
  description?: string;
}

export interface CardByUserResponse {
  id: string;
  name: string;
  description?: string;
  tasks_count: number;
  list_member: string[];
  createdAt: string;
}

export interface ICardService {
  createCard(input: CreateCardInput): Promise<Card>;
  getAllCards(boardId: string): Promise<Card[]>;
  getCardById(boardId: string, cardId: string): Promise<Card>;
  getCardsByUser(
    boardId: string,
    userId: string,
  ): Promise<CardByUserResponse[]>;
  updateCard(
    boardId: string,
    cardId: string,
    data: Partial<Card>,
  ): Promise<Card>;
  deleteCard(boardId: string, cardId: string): Promise<void>;
}

export class CardService implements ICardService {
  private cardRepository = new CardRepository();
  private boardRepository = new BoardRepository();

  async createCard(input: CreateCardInput): Promise<Card> {
    const { boardId, ownerId, name, description } = input;

    if (!name) throw new Error("Card Name cannot be null");
    if (!boardId) throw new Error("Board Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);

    if (!boardDoc) throw new Error("Board not found");

    const dataCard = {
      boardId: boardId,
      name: name,
      description: description || "",
      ownerId: ownerId,
    };

    return await this.cardRepository.create(dataCard);
  }

  async getAllCards(boardId: string): Promise<Card[]> {
    if (!boardId) throw new Error("Board Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    return await this.cardRepository.findCardsByBoardId(boardId);
  }

  async getCardById(boardId: string, cardId: string): Promise<Card> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) throw new Error("Card not found");

    return card;
  }

  async getCardsByUser(
    boardId: string,
    userId: string,
  ): Promise<CardByUserResponse[]> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!userId) throw new Error("User Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    const cards = await this.cardRepository.findCardsByBoardIdAndOwnerId(
      boardId,
      userId,
    );

    return cards.map((card) => ({
      id: card.id,
      name: card.name,
      description: card.description,
      tasks_count: 0, // update then
      list_member: [], // update then
      createdAt: card.createdAt ? String(card.createdAt) : "",
    }));
  }

  async updateCard(
    boardId: string,
    cardId: string,
    data: Partial<Card>,
  ): Promise<Card> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) throw new Error("Card not found");

    return await this.cardRepository.update(cardId, data);
  }

  async deleteCard(boardId: string, cardId: string): Promise<void> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!cardId) throw new Error("Card Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    const card = await this.cardRepository.findById(cardId);
    if (!card || card.boardId !== boardId) throw new Error("Card not found");

    await this.cardRepository.delete(cardId);
  }
}
