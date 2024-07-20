const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//precisamos apagar após utilizar a primeira vez
//Category.sync({ force: true }); //cria a tabela categories
module.exports = Category;