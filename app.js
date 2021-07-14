import * as API         from './lib/api/index.js';
import * as RestAPI     from './lib/api/rest-api/app.js';
import * as DomainModel from './lib/domain-model/index.js';
import Logger           from './lib/infrastructure/Logger.js';
import UseCaseBase      from './lib/use-cases/Base.js';
import config           from './lib/config.cjs';

const logger  = new Logger();

API.setLogger(logger);

RestAPI.start({ appPort: config.appPort });

const sequelize = DomainModel.initModels(config.db);

UseCaseBase.setSequelizeInstanse(sequelize);

process.on('SIGTERM', async () => {
    logger.info('[App] SIGTERM signal catched');

    await shutdown();
});

process.on('SIGINT', async () => {
    logger.info('[App] SIGINT signal catched');

    await shutdown();
});

process.on('unhandledRejection', error => {
    console.error(error);

    logger.fatal({
        type  : 'UnhandledRejection',
        error : error.stack
    });
});

process.on('uncaughtException', error => {
    console.error(error);

    logger.fatal({
        type  : 'UncaughtException',
        error : error.stack
    });
});

async function shutdown() {
    await RestAPI.stop();
    logger.info('[App] Closing sequelize connections');
    await sequelize.close();

    logger.info('[App] Exit');
    process.exit(0);
}
