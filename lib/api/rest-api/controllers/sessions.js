import chista from '../chista.js';
import CheckSession from '../../../use-cases/sessions/CheckSession.js';
import CreateSession from '../../../use-cases/sessions/CreateSession.js';

export default {
    async checkSession(req, res, next) {
        const promise = chista.runUseCase(CheckSession, {
            params : { token: req.headers.authorization }
        });

        try {
            const tokenData = await promise;

            /* eslint no-param-reassign: 0 */
            // eslint-disable-next-line require-atomic-updates
            req.session = {
                context : {
                    userId : tokenData.id
                }
            };

            return next();
        } catch {
            return chista.renderPromiseAsJson(req, res, promise);
        }
    },
    createSession : chista.makeUseCaseRunner(CreateSession, req => req.body)
};
