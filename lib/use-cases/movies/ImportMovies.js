import { X } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';
import Actor from '../../domain-model/Actor.js';
import ActorMovie from '../../domain-model/ActorMovie.js';
import DMX from '../../domain-model/X.js';
import { dumpMovie } from '../utils/dumps.js';
import moviesParser from '../utils/moviesParser.js';

class ImportMovies extends Base {
    async validate({ text }) {
        const movies = moviesParser(text);

        const validationRules = {
            movies : [
                'required',
                {
                    'list_length' : [ 1, 100 ]
                },
                {
                    'list_of_objects' : [
                        {
                            title       : [ 'required', 'string', { 'max_length': 60 } ],
                            releaseYear : [ 'required', 'integer', { 'min_number': 1900 }, { 'max_number': 2100 } ],
                            format      : [ 'required', { 'one_of': [ 'VHS', 'DVD', 'Blu-Ray' ] } ],
                            stars       : [ 'required', { 'list_of': [ 'string', { 'max_length': 60 }, { 'like': '\\w+ \\w+' } ] } ]
                        }
                    ]
                }
            ]
        };

        return this.doValidation({ movies }, validationRules);
    }

    async execute({ movies }) {
        const movieModels = [];

        for (const movie of movies) {
            const { title, releaseYear: year, format, stars: actors } = movie;

            let movieModel;

            try {
                movieModel = await Movie.create({
                    userId : this.context.userId,
                    title,
                    year   : new Date(Date.UTC(year, 0, 1)),
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

            for (const actor of actors) {
                let actorModel = await Actor.findOne({ where: { name: actor } });

                if (!actorModel) {
                    actorModel = await Actor.create({ name: actor });
                }

                await ActorMovie.create({ actorId: actorModel.id, movieId: movieModel.id });
            }

            movieModels.push(movieModel);
        }

        return {
            data : movieModels.map(movieModel => dumpMovie(movieModel))
        };
    }
}

export default ImportMovies;
