module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Movies', {
            id : {
                type          : Sequelize.BIGINT,
                autoIncrement : true,
                primaryKey    : true
            },
            userId : {
                type       : Sequelize.BIGINT,
                references : {
                    model : 'Users',
                    key   : 'id'
                },
                onUpdate  : 'cascade',
                onDelete  : 'cascade',
                allowNull : false
            },
            title : {
                type      : Sequelize.STRING,
                unique    : true,
                allowNull : false
            },
            year : {
                type      : Sequelize.DATE,
                allowNull : false
            },
            format : {
                type      : Sequelize.ENUM('VHS', 'DVD', 'Blu-Ray'),
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
        return queryInterface.dropTable('Movies');
    }
};
