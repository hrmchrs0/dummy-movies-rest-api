import { X } from '../../../packages.js';
import Base from '../Base.js';
import Movie from '../../domain-model/Movie.js';

class DeleteMovie extends Base {
    static validationRules = {
        id : [ 'required', 'positive_integer' ]
    };

    async execute({ id }) {
        const movieModel = await Movie.findOne({ where: { id } });

        if (!movieModel || movieModel.userId !== this.context.userId) {
            throw new X({
                code   : 'MOVIE_NOT_FOUND',
                fields : { id }
            });
        }

        await movieModel.destroy();

        return {};
    }
}

export default DeleteMovie;
