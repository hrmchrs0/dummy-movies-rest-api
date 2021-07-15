import { X } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';
import Actor from '../../domain-model/Actor.js';
import ActorMovie from '../../domain-model/ActorMovie.js';
import DMX from '../../domain-model/X.js';
import { getDateByYear, getCurrentYear } from '../utils/time.js';
import { dumpMovie, dumpActor } from '../utils/dumps.js';

class CreateMovie extends Base {
    async validate(params) {
        const validationRules = {
            title  : [ 'required', 'string', { 'max_length': 60 } ],
            year   : [ 'required', 'integer', { 'min_number': 1900 }, { 'max_number': getCurrentYear() } ],
            format : [ 'required', { 'one_of': [ 'VHS', 'DVD', 'Blu-Ray' ] } ],
            actors : [ 'required', { 'list_of': [ 'string', { 'max_length': 60 }, { 'like': '^[A-Za-z-]*[A-Za-z] [A-Za-z-]*[A-Za-z]$' } ] }, 'list_items_unique' ]
        };

        return this.doValidation(params, validationRules);
    }

    async execute({ title, year, format, actors }) {
        let movieModel;

        try {
            movieModel = await Movie.create({
                userId : this.context.userId,
                title,
                year   : getDateByYear(year),
                format
            });
        } catch (err) {
            if (err instanceof DMX.NotUnique) {
                throw new X({
                    code   : 'MOVIE_EXISTS',
                    fields : { [err.field]: 'NOT_UNIQUE' }
                });
            }

            throw err;
        }

        const actorModels = [];

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

export default CreateMovie;
