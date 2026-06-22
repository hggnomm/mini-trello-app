import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { Cardcontroller } from "../controllers/card.controller";

const router = Router();
const cardController = new Cardcontroller();

router.use(requireAuth);

router.post("/:boardId/cards", cardController.createCard);
router.get("/:boardId/cards", cardController.getAllCards);
router.get("/:boardId/cards/:id", cardController.getCardById);

export default router;
