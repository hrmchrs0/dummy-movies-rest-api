import chista from '../chista.js';
import GetMovies from '../../../use-cases/movies/GetMovies.js';
import CreateMovie from '../../../use-cases/movies/CreateMovie.js';
import ImportMovies from '../../../use-cases/movies/ImportMovies.js';
import GetMovie from '../../../use-cases/movies/GetMovie.js';
import UpdateMovie from '../../../use-cases/movies/UpdateMovie.js';
import DeleteMovie from '../../../use-cases/movies/DeleteMovie.js';

export default {
    getMovies    : chista.makeUseCaseRunner(GetMovies, req => req.query),
    createMovie  : chista.makeUseCaseRunner(CreateMovie, req => req.body),
    importMovies : async (req, res, next) => {
        if (!req.file) {
            next(new Error('no_file'));

            return;
        }

        const resultPromise = chista.runUseCase(ImportMovies, {
            params  : { text: req.file.buffer.toString() },
            context : chista.defaultContextBuilder(req, res)
        });

        return chista.renderPromiseAsJson(req, res, resultPromise);
    },
    getMovie    : chista.makeUseCaseRunner(GetMovie, req => req.params),
    updateMovie : chista.makeUseCaseRunner(UpdateMovie, req => ({ ...req.params, ...req.body })),
    deleteMovie : chista.makeUseCaseRunner(DeleteMovie, req => req.params)
};
