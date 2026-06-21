import { Router } from "express";

export abstract class BaseController {
  public router: Router;

  constructor() {
    this.router = Router();
  }
  public abstract initializeRoutes(): void;
}
