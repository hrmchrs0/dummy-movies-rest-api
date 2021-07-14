import Sequelize from 'sequelize';
import X from './X.js';

class Base extends Sequelize.Model {
    static init(sequelize) {
        const options = this.options || {};

        super.init(this.schema, { ...options, sequelize });
    }

    static initAssociations() {
        if (this.initRelations) this.initRelations();
    }

    async save(...args) {
        try {
            return await super.save(...args);
        } catch (err) {
            if (err instanceof Sequelize.UniqueConstraintError) {
                const error = err.errors[0];

                throw new X.NotUnique({
                    message : error.message,
                    field   : error.path,
                    parent  : err
                });
            }

            throw err;
        }
    }
}

export default Base;
