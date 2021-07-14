module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Actors', {
            id : {
                type          : Sequelize.BIGINT,
                autoIncrement : true,
                primaryKey    : true
            },
            name : {
                type      : Sequelize.STRING,
                unique    : true,
                allowNull : false
            },
            createdAt : {
                type      : Sequelize.DATE,
                allowNull : false
            },
            updatedAt : {
                type      : Sequelize.DATE,
                allowNull : false
            }
        });
    },
    down : (queryInterface) => {
        return queryInterface.dropTable('Actors');
    }
};
