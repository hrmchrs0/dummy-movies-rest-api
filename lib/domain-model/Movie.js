import { DataTypes } from '../../packages.js';
import Base from './Base.js';
import User from './User.js';

class Movie extends Base {
    static schema = {
        id : {
            type          : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey    : true
        },
        userId : {
            type       : DataTypes.BIGINT,
            references : {
                model : 'Users',
                key   : 'id'
            },
            onUpdate  : 'cascade',
            onDelete  : 'cascade',
            allowNull : false
        },
        title : {
            type      : DataTypes.STRING,
            unique    : true,
            allowNull : false
        },
        year : {
            type      : DataTypes.DATE,
            allowNull : false
        },
        format : {
            type      : DataTypes.ENUM('VHS', 'DVD', 'Blu-Ray'),
            allowNull : false
        }
    };

    static initRelations() {
        Movie.belongsTo(User, { foreignKey: 'userId' });
    }
}

export default Movie;
