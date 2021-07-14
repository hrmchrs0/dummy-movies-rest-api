import pino from 'pino';
import config from '../config.cjs';
import clsNamespace from '../clsNamespace.js';

const options = {
    prettyPrint : config.env !== 'production',
    redact      : {
        paths : [
            'msg.*.data.password',
            'msg.*.data.confirmPassword',
            'msg.*.password',
            'msg.*.confirmPassword',
            'msg.params.token',
            'msg.result.data.jwt',
            'msg.result.jwt'
        ],
        censor : '**SENSITIVE DATA**'
    }
};

class Logger {
    #logger = null;

    constructor() {
        this.#logger = pino(options);

        this.#generateWrappedMethods();
    }

    #generateWrappedMethods = () => {
        const methods = [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ];

        for (const method of methods) {
            this[method] = (data) => {
                const traceID = clsNamespace.get('traceID');

                this.#logger[method]({ traceID }, data);
            };
        }
    }
}

export default Logger;
