const express = require("express");
const router = express.Router(); // para usarmos rotas sem a variavel app
const Category = require('../categories/Category'); //importando model 
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require("../middleware/adminAuth");
router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles });
    });

});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    });

})
router.post('/article/save', adminAuth, (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category//chave estrangeira na tabela article
    }).then(() => {
        res.redirect("/admin/articles");
    });
})
router.post("/articles/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    if (id != undefined && !isNaN(id)) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        });
    } else {
        res.redirect('/admin/articles');
    }
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article: article, categories: categories });
            });
        } else {
            res.redirect('/admin/articles');
        }
    }).catch(err => {
        res.redirect('/admin/articles');
    });
});

router.post("/articles/updat", adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Article.update({ title: title, slug: slugify(title), body: body, categoryId: category, }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});
router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num;
    let offset;
    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 4;
    }
    //seleciona todos os articos e conta o total
    Article.findAndCountAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4, //podemos exibir 4 artigos por pagina
        offset: offset //offset quer dizer que apartir de um numero vamos exibi se ofset==4 então exibimos o artigo 5,6,7 e 8
    }).then(articles => {
        let next;
        if (offset + 4 > articles.count) { //se eu atingir o limite de paginas nao carrego a proxima pagina
            next = false;
        } else {//senão eu carrego
            next = true;
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", { result: result, categories: categories });
        });
    });
});
module.exports = router;