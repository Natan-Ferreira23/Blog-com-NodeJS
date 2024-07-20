const express = require("express");
const router = express.Router(); // para usarmos rotas sem a variavel app
const Category = require('./Category');
const slugify = require('slugify');


router.get("/admin/categories/new", (req, res) => {
    res.render('./admin/categories/new');
})

router.post("/categories/save", (req, res) => {
    let title = req.body.title;
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title) //computação e informatica => computação-e-informatica
        }).then(() => {
            res.redirect("/admin/categories");
        });
    } else {
        res.redirect("/admin/categories/new");
    }
});


router.get("/admin/categories", (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/categories/index', { categories: categories });
    });


    router.post("/categories/delete", (req, res) => {
        let id = req.body.id;
        if (id != undefined && !isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            });
        } else {
            res.redirect('/admin/categories');
        }
    });

});

router.get("/admin/categories/edit/:id", (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }
    Category.findByPk(id).then(categorie => {
        if (categorie != undefined) {
            res.render('admin/categories/edit', { categorie: categorie });
        } else {
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    });
});

router.post("/categories/updat", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    });
});
module.exports = router;