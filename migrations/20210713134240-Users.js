module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id : {
                type          : Sequelize.BIGINT,
                autoIncrement : true,
                primaryKey    : true
            },
            email : {
                type      : Sequelize.STRING,
                unique    : true,
                allowNull : false
            },
            name : {
                type      : Sequelize.STRING,
                allowNull : false
            },
            passwordHash : {
                type      : Sequelize.STRING,
                allowNull : false
            },
            salt : {
                type      : Sequelize.STRING,
                allowNull : false
            }
        });
    },
    down : (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};
