import { settings } from './utils/settings';
import { createApp } from './app';
import { logger } from './utils/logger';
import http from 'http';
import { initSocket } from './socket/socket';

const port = settings.PORT;

const app = createApp();
const server = http.createServer(app);

initSocket(server);

if (require.main === module) {
    server.listen(port, () => {
        logger.info(`App running on port ${port}.`);
    });
}
