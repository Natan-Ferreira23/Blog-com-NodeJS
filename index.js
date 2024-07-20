const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require("express-session"); //importando biblioteca de sessão
//importando controlers 
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');
//importando models
const Article = require('./articles/Article');//importando model article
const Category = require('./categories/Category'); //importando model category
const User = require("./users/User");
const porta = 3000;//porta
//view engine para usar o ejs
app.set('view engine', 'ejs');
//session
/* por conta das requisições, para não estourar a memoria em projetos grandes utilizamos
o redis, um banco de dados próprio para sessões e cache.
*/
app.use(session({
    secret: "qualquercoisa", //pode colocar qualquer coisa
    cookie: { maxAge: 30000 }  //esse cookie aponta que há uma sessão no servidor,e ele expira em 30 segundos ==3000 milisegundos
}));
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//estaticos
app.use(express.static('public'));

//database 
connection.authenticate().then(() => {
    console.log("Conexão realizada com sucesso!")
}).catch((erro) => {
    console.log(erro)
})
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);
//com sessões nos acessamos os dados em qualquer rota do servidor
//os dados ficam no servidor
app.get("/session", (req, res) => { //nessa rota salvo os dados
    req.session.treinamento = "formação nodjs",
        req.session.ano = 2019,
        req.session.email = "natan@gmail.com",
        req.session.user = {
            username: "natan",
            email: "email@gmail.com",
            id: 10
        }
    res.send("Sessão gerada");
});
app.get("/leitura", (req, res) => { // nessa acesso os dados da sessão
    res.json({
        treinamento: req.session.treinamento,
        email: req.session.email,
        ano: req.session.ano,
        user: req.session.user
    });
});
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
        , limit: 4
    }).then((articles) => {

        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories });
        });

    });
});
app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        }, include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            });
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(porta, () => {
    console.log("Servidor rodando ! na porta " + porta);
});