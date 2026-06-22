import { settings } from './utils/settings';
import { createApp } from './app';
import { logger } from './utils/logger';

const port = settings.PORT;

const app = createApp();

if (require.main === module) {
    app.listen(port, () => {
        logger.info(`App running on port ${port}.`);
    });
}
