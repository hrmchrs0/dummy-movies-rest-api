import Sequelize from 'sequelize';
import User from './User.js';
import Movie from './Movie.js';
import Actor from './Actor.js';
import ActorMovie from './ActorMovie.js';

function initAllModels(dbConfig) {
    const { dialect, host, port, database, username, password } = dbConfig;

    const sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        logging        : false,
        dialectOptions : {
            connectTimeout : 10000
        },
        pool : {
            min     : 0,
            max     : 10,
            idle    : 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
            acquire : 30000 // ..., that pool will try to get connection before throwing error
        },
        retry : { // Set of flags that control when a query is automatically retried.
            match : [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /TimeoutError/,
                /SequelizeDatabaseError/
            ],
            max : 4 // How many times a failing query is automatically retried.
        }
    });

    const models = {
        User,
        Movie,
        Actor,
        ActorMovie
    };

    Object.values(models).forEach(model => model.init(sequelize));
    Object.values(models).forEach(model => model.initAssociations());

    return sequelize;
}

export default initAllModels;
