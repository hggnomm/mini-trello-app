import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { checkConnection, getDb } from './libs/firebase/firebase';

export function createApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });

    app.get('/health', async (req: Request, res: Response) => {
        const db = await checkConnection();
        try {
            res.status(200).json({ status: 'up', db: db });
        } catch (error) {
            res.status(500).json({ status: 'error', db: "Error connect to Firestore" });
        }
    });

    app.get('/health/:id', (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', id: req?.params?.id });
    });

    return app;
}
