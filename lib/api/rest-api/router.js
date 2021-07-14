import express from 'express';
import middlewares from './middlewares.js';
import controllers from './controllers/index.js';

const router = express.Router();

const checkSession = controllers.sessions.checkSession;
const multer = middlewares.multer;

router.post(
    '/sessions',
    controllers.sessions.createSession
);

router.post(
    '/users',
    controllers.users.createUser
);

router.get(
    '/movies',
    checkSession,
    controllers.movies.getMovies
);

router.post(
    '/movies',
    checkSession,
    controllers.movies.createMovie
);

router.post(
    '/movies/import',
    checkSession,
    multer.single('movies'),
    controllers.movies.importMovies
);

router.get(
    '/movies/:id',
    checkSession,
    controllers.movies.getMovie
);

router.patch(
    '/movies/:id',
    checkSession,
    controllers.movies.updateMovie
);

router.delete(
    '/movies/:id',
    checkSession,
    controllers.movies.deleteMovie
);


export default router;
