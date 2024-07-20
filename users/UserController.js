const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {

    User.findAll().then((users) => {
        res.render("admin/users/index", { users: users });
    });
});
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});
router.post("/users/create", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //verificando se o email informado ja esta cadastrado
    User.findOne({ where: { email: email } }).then((user) => {
        if (user == undefined) { //se não existir nós cadastramos
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt); // fazendo um hash da senha
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(err => {
                res.redirect("/");
            });
        } else { //se já existir o email nós rediricionamos
            res.redirect("/admin/users/create");
        }
    })


});
router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {//valida a senha
            let correct = bcrypt.compareSync(password, user.password); //verifica se a senha do login é igual a senha do banco
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });
});

//rota para deslogar
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});
module.exports = router;