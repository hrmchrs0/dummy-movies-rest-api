import sortBy from 'lodash/sortBy.js';
import { Op } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';
import Actor from '../../domain-model/Actor.js';
import { dumpMovie } from '../utils/dumps.js';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

class GetMovies extends Base {
    static validationRules = {
        title  : [ 'string', { 'max_length': 60 } ],
        search : [ 'string', { 'max_length': 60 } ],
        sort   : [ { 'one_of': [ 'id', 'title', 'year' ] } ],
        order  : [ { 'one_of': [ 'ASC', 'DESC' ] } ],
        limit  : [ 'positive_integer' ],
        offset : [ 'positive_integer' ]
    };

    async execute({ title, search, sort, order, limit, offset }) {
        let movieModels;

        const limitValue = limit || DEFAULT_LIMIT;
        const offsetValue = offset || DEFAULT_OFFSET;

        if (search) {
            const movieModelsById = new Map();

            let tempMovieModels = await Movie.findAll({ where: { title: { [Op.substring]: search } } });

            tempMovieModels.forEach(movieModel => movieModelsById.set(movieModel.id, movieModel));

            const actorModels = await Actor.findAll({ where: { name: { [Op.substring]: search } }, include: { model: Movie, as: 'movies' } });

            for (const actorModel of actorModels) {
                for (const movieModel of actorModel.movies) {
                    if (!movieModelsById.has(movieModel.id)) {
                        movieModelsById.set(movieModel.id, movieModel);
                    }
                }
            }

            tempMovieModels = Array.from(movieModelsById.values());

            tempMovieModels = sortBy(tempMovieModels, [ sort || 'id' ]);

            if (order === 'DESC') {
                tempMovieModels.reverse();
            }

            movieModels = tempMovieModels.slice(offsetValue, offsetValue + limitValue);
        } else {
            const sortOrderValues = [ 'id', 'ASC' ];

            if (sort) {
                sortOrderValues[0] = sort;
            }

            if (order) {
                sortOrderValues[1] = order;
            }

            if (title) {
                movieModels = await Movie.findAll({
                    where  : { title: { [Op.substring]: title } },
                    order  : [ sortOrderValues ],
                    limit  : limitValue,
                    offset : offsetValue
                });
            } else {
                movieModels = await Movie.findAll({
                    order  : [ sortOrderValues ],
                    limit  : limitValue,
                    offset : offsetValue
                });
            }
        }

        return {
            data : movieModels.map(movieModel => dumpMovie(movieModel))
        };
    }
}

export default GetMovies;
