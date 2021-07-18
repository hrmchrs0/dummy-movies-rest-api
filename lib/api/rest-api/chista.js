import ChistaModule from 'chista';
import logger from '../logger.js';
import * as chistaUtils from './chistaUtils.js';

const chista = new ChistaModule.default({
    defaultLogger : (type, data) => logger[type](data)
});

chista.runUseCase = chistaUtils.runUseCase;
chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.renderPromiseAsJson = chistaUtils.renderPromiseAsJson;

export default chista;
