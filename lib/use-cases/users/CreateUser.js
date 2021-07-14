import { X } from '../../../packages.js';
import Base from '../Base.js';
import User from '../../domain-model/User.js';
import DMX from '../../domain-model/X.js';
import { generateToken } from '../utils/jwtUtils.js';

class CreateUser extends Base {
    static validationRules = {
        email           : [ 'required', 'email', { 'max_length': 255 }, 'to_lc' ],
        name            : [ 'required', 'string', { 'max_length': 60 }, { 'like': '\\w+ \\w+' } ],
        password        : [ 'required', 'string', { 'min_length': 8 } ],
        confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
    };

    async execute({ email, name, password }) {
        try {
            const userModel = await User.create({ email, name, password });

            return { token: generateToken({ id: userModel.id }) };
        } catch (err) {
            if (err instanceof DMX.NotUnique) {
                throw new X({
                    code   : 'EMAIL_NOT_UNIQUE',
                    fields : { [err.field]: 'NOT_UNIQUE' }
                });
            }

            throw err;
        }
    }
}

export default CreateUser;
