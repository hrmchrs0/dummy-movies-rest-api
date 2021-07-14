import { DataTypes } from '../../packages.js';
import Base from './Base.js';
import Actor from './Actor.js';
import Movie from './Movie.js';

class ActorMovie extends Base {
    static schema = {
        actorId : {
            type       : DataTypes.BIGINT,
            primaryKey : true,
            references : {
                model : 'Actors',
                key   : 'id'
            },
            onUpdate  : 'cascade',
            onDelete  : 'cascade',
            allowNull : false
        },
        movieId : {
            type       : DataTypes.BIGINT,
            primaryKey : true,
            references : {
                model : 'Movies',
                key   : 'id'
            },
            onUpdate  : 'cascade',
            onDelete  : 'cascade',
            allowNull : false
        }
    };

    static options = {
        tableName  : 'Actors_Movies',
        timestamps : false
    };

    static initRelations() {
        Actor.belongsToMany(Movie, { through: ActorMovie, foreignKey: 'actorId', as: 'movies' });
        Movie.belongsToMany(Actor, { through: ActorMovie, foreignKey: 'movieId', as: 'actors' });
    }
}

export default ActorMovie;
