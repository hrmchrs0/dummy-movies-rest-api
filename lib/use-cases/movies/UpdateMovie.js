import { X } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';
import Actor from '../../domain-model/Actor.js';
import ActorMovie from '../../domain-model/ActorMovie.js';
import { getDateByYear, getCurrentYear } from '../utils/time.js';
import { dumpMovie, dumpActor } from '../utils/dumps.js';

class UpdateMovie extends Base {
    async validate(params) {
        const validationRules = {
            id     : [ 'required', 'positive_integer' ],
            title  : [ 'required', 'string', { 'max_length': 60 } ],
            year   : [ 'required', 'positive_integer', { 'max_number': getCurrentYear() } ],
            format : [ 'required', { 'one_of': [ 'VHS', 'DVD', 'Blu-Ray' ] } ],
            actors : [ 'required', { 'list_of': [ 'string', { 'max_length': 60 }, { 'like': '\\w+ \\w+' } ] } ]
        };

        return this.doValidation(params, validationRules);
    }

    async execute({ id, title, year, format, actors }) {
        const movieModel = await Movie.findOne({ where: { id } });

        if (!movieModel || movieModel.userId !== this.context.userId) {
            throw new X({
                code   : 'MOVIE_NOT_FOUND',
                fields : { id }
            });
        }

        await movieModel.update({
            title,
            year : getDateByYear(year),
            format
        });

        const actorModels = [];

        await ActorMovie.destroy({ where: { movieId: movieModel.id } });

        for (const actor of actors) {
            let actorModel = await Actor.findOne({ where: { name: actor } });

            if (!actorModel) {
                actorModel = await Actor.create({ name: actor });
            }

            await ActorMovie.create({ actorId: actorModel.id, movieId: movieModel.id });

            actorModels.push(actorModel);
        }

        return {
            data : {
                ...dumpMovie(movieModel),
                actors : actorModels.map(actorModel => dumpActor(actorModel))
            }
        };
    }
}

export default UpdateMovie;
