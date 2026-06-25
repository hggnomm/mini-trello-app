import { Request, Response } from "express";
import { GitHubAttachmentService } from "../services/github_attachment.service";

export class GitHubAttachmentController {
  private service = new GitHubAttachmentService();

  getAttachments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;

      const data = await this.service.getAttachments(taskId);

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  attach = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;

      const result = await this.service.attach(taskId, req.body);

      res.status(201).json({ attachmentId: result.attachmentId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId, attachmentId } = req.params;
      await this.service.remove(taskId, attachmentId);
      
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
