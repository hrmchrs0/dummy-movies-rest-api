import ChistaModule from 'chista';
import logger from '../logger.js';
import * as chistaUtils from './chistaUtils.js';

const chista = new ChistaModule.default({
    defaultLogger : (type, data) => logger[type](data)
});

chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.runUseCase = chistaUtils.runUseCase;

export default chista;
