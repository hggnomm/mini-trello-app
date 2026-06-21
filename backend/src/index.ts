import { createApp } from './app';

const port = process.env.PORT || 3000;

const app = createApp();

if (require.main === module) {
    app.listen(port, () => {
        console.log(`App running on port ${port}.`);
    });
}
