import { X } from '../../../packages.js';
import Base from '../Base.js';
import User from '../../domain-model/User.js';
import { generateToken } from '../utils/jwtUtils.js';

class CreateSession extends Base {
    static validationRules = {
        email    : [ 'required', 'email', { 'max_length': 255 }, 'to_lc' ],
        password : [ 'required', 'string', { 'min_length': 8 } ]
    };

    async execute({ email, password }) {
        const userModel = await User.findOne({ where: { email } });

        if (!userModel || !await userModel.checkPassword(password)) {
            throw new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : {
                    email    : 'AUTHENTICATION_FAILED',
                    // eslint-disable-next-line more/no-hardcoded-password
                    password : 'AUTHENTICATION_FAILED'
                }
            });
        }

        return { token: generateToken({ id: userModel.id }) };
    }
}

export default CreateSession;
