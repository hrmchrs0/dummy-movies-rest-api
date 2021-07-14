import { X } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';
import Actor from '../../domain-model/Actor.js';
import { dumpMovie, dumpActor } from '../utils/dumps.js';

class GetMovie extends Base {
    static validationRules = {
        id : [ 'required', 'positive_integer' ]
    };

    async execute({ id }) {
        const movieModel = await Movie.findOne({ where: { id }, include: [ { model: Actor, as: 'actors' } ] });

        if (!movieModel) {
            throw new X({
                code   : 'MOVIE_NOT_FOUND',
                fields : { id }
            });
        }

        return {
            data : {
                ...dumpMovie(movieModel),
                actors : movieModel.actors.map(actorModel => dumpActor(actorModel))
            }
        };
    }
}

export default GetMovie;
