const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//precisamos apagar após utilizar a primeira vez
//User.sync({ force: true }); //cria a tabela categories
module.exports = User;