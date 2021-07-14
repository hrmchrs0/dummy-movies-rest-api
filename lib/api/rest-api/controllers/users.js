import chista from '../chista.js';
import CreateUser from '../../../use-cases/users/CreateUser.js';

export default {
    createUser : chista.makeUseCaseRunner(CreateUser, req => req.body)
};
