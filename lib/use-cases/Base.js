import { UseCaseBase as ChistaUseCaseBase } from '../../packages.js';
import './configureLivr.js';

class UseCaseBase extends ChistaUseCaseBase {
    static sequelizeInstanse = null;

    static setSequelizeInstanse(sequelize) {
        UseCaseBase.sequelizeInstanse = sequelize;
    }
}

export default UseCaseBase;
