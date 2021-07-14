export function dumpMovie(movie) {
    const dump = {
        id        : movie.id,
        title     : movie.title,
        year      : movie.year.getFullYear(),
        format    : movie.format,
        createdAt : movie.createdAt.toISOString(),
        updatedAt : movie.updatedAt.toISOString()
    };

    return dump;
}

export function dumpActor(actor) {
    const dump = {
        id        : actor.id,
        name      : actor.name,
        createdAt : actor.createdAt.toISOString(),
        updatedAt : actor.updatedAt.toISOString()
    };

    return dump;
}
