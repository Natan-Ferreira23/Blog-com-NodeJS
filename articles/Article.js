const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category'); //importando category

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: { /* Um slug é a parte da URL que vem após o nome de domínio, 
        fornecendo uma descrição legível dos conteúdos da página. 
        Por exemplo, na URL https://exemplo.com/o-que-e-um-slug,*/
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
//relacionamento entre tabelas;
Category.hasMany(Article) // tem muitos // uma Categoria tem muitos Artigos
Article.belongsTo(Category); //Um Artigo pertence a uma  Categoria

//precisamos apagar após utilizar a primeira vez 
//Article.sync({ force: true }); cria a tabela articles
module.exports = Article;