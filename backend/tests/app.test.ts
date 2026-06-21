import request from 'supertest';
import { createApp } from '../src/app';

describe('API Endpoints', () => {
    let app: any;

    beforeAll(() => {
        app = createApp();
    });

    describe('GET /', () => {
        it('should return 200 and Hello, World!', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toBe('Hello, World!');
        });
    });

    describe('GET /health', () => {
        it('should return 200 and status up', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toBe('up');
        });
    });

    describe('GET /health/:id', () => {
        it('should return 200 and status ok with id', async () => {
            const res = await request(app).get('/health/123');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ status: 'ok', id: '123' });
        });
    });
});
