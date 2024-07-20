const Sequelize = require('sequelize');
const connection = new Sequelize('guiapress', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00' //colocando o horario utilizado no banco de dados
});

module.exports = connection;