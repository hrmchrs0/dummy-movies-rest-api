module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Actors_Movies', {
            actorId : {
                type       : Sequelize.BIGINT,
                primaryKey : true,
                references : {
                    model : 'Actors',
                    key   : 'id'
                },
                onUpdate  : 'cascade',
                onDelete  : 'cascade',
                allowNull : false
            },
            movieId : {
                type       : Sequelize.BIGINT,
                primaryKey : true,
                references : {
                    model : 'Movies',
                    key   : 'id'
                },
                onUpdate  : 'cascade',
                onDelete  : 'cascade',
                allowNull : false
            }
        });
    },
    down : (queryInterface) => {
        return queryInterface.dropTable('Actors_Movies');
    }
};
