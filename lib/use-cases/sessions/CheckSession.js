import { X } from '../../../packages.js';
import Base from '../Base.js';
import User from '../../domain-model/User.js';
import { verifyToken } from '../utils/jwtUtils.js';

class CheckSession extends Base {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const tokenData = await verifyToken(token);

            await User.findOne({ where: { id: tokenData.id } });

            return tokenData;
        } catch {
            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
    }
}

export default CheckSession;
