import { Request, Response } from "express";
import {
  CardService,
  CreateCardInput,
  ICardService,
} from "../services/card.service";
import { getAuthenticatedUser } from "../utils/auth";

export class Cardcontroller {
  private cardService: ICardService = new CardService();

  createCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId } = req.params;
      const { name, description } = req.body;
      const user = getAuthenticatedUser(req);

      const newCard: CreateCardInput = await this.cardService.createCard({
        boardId,
        ownerId: user.id,
        name,
        description,
      });
      res.status(201).json(newCard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
