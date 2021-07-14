import crypto from 'crypto';
import { DataTypes } from '../../packages.js';
import Base from './Base.js';
import Movie from './Movie.js';

const SALT_LENGTH = 16;
const KEY_LENGTH  = 64;

class User extends Base {
    static schema = {
        id : {
            type          : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey    : true
        },
        email : {
            type      : DataTypes.STRING,
            unique    : true,
            allowNull : false
        },
        name : {
            type      : DataTypes.STRING,
            allowNull : false
        },
        passwordHash : {
            type      : DataTypes.STRING,
            allowNull : false
        },
        salt : {
            type      : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.VIRTUAL,
            set(password) {
                const salt = this._generateSalt();

                this.setDataValue('salt', salt);
                this.setDataValue('passwordHash', this._hashPassword(password, salt));
            }
        }
    };

    static options = {
        timestamps : false
    };

    static initRelations() {
        User.hasMany(Movie, { foreignKey: 'userId' });
    }

    checkPassword(plain) {
        const hash = this._hashPassword(plain, this.salt);

        return hash === this.passwordHash;
    }

    _generateSalt() {
        const salt = crypto.randomBytes(SALT_LENGTH);

        return salt.toString('hex');
    }

    _hashPassword(password, salt) {
        const hash = crypto.scryptSync(password, salt, KEY_LENGTH); // eslint-disable-line no-sync

        return hash.toString('hex');
    }
}

export default User;
