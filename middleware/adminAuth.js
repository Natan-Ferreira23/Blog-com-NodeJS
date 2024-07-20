function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        next();//serve para passar da requisição para a rota que voce quer
    } else {
        res.redirect("/");
    }

}
module.exports = adminAuth;