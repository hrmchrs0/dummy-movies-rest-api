/* eslint-disable brace-style */
let _LOGGER = null;

export function setLogger(logger) {
    _LOGGER = logger;
}

export default {
    fatal(data) { _LOGGER.fatal(data); },
    error(data) { _LOGGER.error(data); },
    warn(data)  { _LOGGER.warn(data); },
    info(data)  { _LOGGER.info(data); },
    debug(data) { _LOGGER.debug(data); },
    trace(data) { _LOGGER.trace(data); }
};
