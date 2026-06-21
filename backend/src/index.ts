import { createApp } from './app';
import { logger } from './utils/logger';

const port = process.env.PORT || 8000;

const app = createApp();

if (require.main === module) {
    app.listen(port, () => {
        logger.info(`App running on port ${port}.`);
    });
}
