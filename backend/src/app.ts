import express, { Express, Request, Response } from 'express';
import cors from 'cors';

export function createApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'up' });
    });

    app.get('/health/:id', (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', id: req?.params?.id });
    });

    return app;
}
