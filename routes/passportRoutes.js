const express = require('express');
const Router = express.Router();

const { ensureAuthenticated, passport, GetSafeUser } = require("../index.js");
module.exports = Router;
const redirectUrl = "/";

Router.get('/auth/logout', async function (req, res) {
    try {
        req.session.destroy();
        req.logout();
    } catch (error) { }
    finally {
        res.redirect('/');
    }
});

Router.get('/auth/discord', passport.authenticate('discord'));

Router.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }),
    function (req, res) {
        //console.log(req)
        res.redirect(redirectUrl)
    }
);
Router.get("/login", (req, res) => {
    res.render("login", { user: GetSafeUser(req.user) })
})
