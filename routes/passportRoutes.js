const express = require('express');
const Router = express.Router();

const { ensureAuthenticated, passport, GetSafeUser, settings } = require("../index.js");
module.exports = Router;
const redirectUrl = settings.get('frontEndUrl');

Router.get('/auth/logout', async (req, res) => {
    try {
        req.session.destroy();
        req.logout();
    } catch (error) { }
    finally {
        res.redirect(redirectUrl);
    }
});

Router.get('/auth/discord', passport.authenticate('discord'));

Router.get('/auth/discord/callback',
    passport.authenticate('discord', {
        successRedirect: redirectUrl, // + path if possible
        failureRedirect: redirectUrl,
    })
);
Router.get("/login", (req, res) => {/*
    res.render("login", { user: GetSafeUser(req.user, true) })*/
})
