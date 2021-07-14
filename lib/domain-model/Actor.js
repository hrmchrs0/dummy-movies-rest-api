import { DataTypes } from '../../packages.js';
import Base from './Base.js';

class Actor extends Base {
    static schema = {
        id : {
            type          : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey    : true
        },
        name : {
            type      : DataTypes.STRING,
            unique    : true,
            allowNull : false
        }
    };
}

export default Actor;
