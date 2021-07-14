import express from 'express';
import { promisify } from '../../../packages.js';
import logger from '../logger.js';
import middlewares from './middlewares.js';
import router from './router.js';

const app = express();

app.use(middlewares.cors);
app.use(middlewares.json);
app.use(middlewares.clsMiddleware);
app.use('/api/v1', router);

let server = null;

export function start({ appPort }) {
    server = app.listen(appPort, () => {
        const { port, address } = server.address();

        logger.info(`[RestApi] Starting at port [${port}] address [${address}]`);
    });

    server.closeAsync = promisify(server.close);
}

export async function stop() {
    if (!server) return;
    logger.info('[RestApi] Closing server');
    await server.closeAsync();
}

export default app;
