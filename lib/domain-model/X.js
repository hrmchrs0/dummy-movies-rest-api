class BaseError extends Error {
    constructor(args = {}) {
        super();

        if (!args.message) throw new Error('"message" is required');
        if (!args.field) throw new Error('"field" required');

        this.message = args.message;
        this.field   = args.field;
        this.parent  = args.parent;
    }
}

class NotUnique extends BaseError { }

export default {
    NotUnique
};
