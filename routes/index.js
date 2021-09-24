const express = require('express');
const path = require('path');
const Router = express.Router();

const { GetSafeUser, app, useEJS } = require('../index');

module.exports = Router;

if (process.env.NODE_ENV === 'production') {
    console.log("Server running in production!");
    if (!useEJS) {
        app.use(express.static('client/public'));
        Router.get('/', (req, res) => {
            res.sendFile(path.resolve(process.cwd(), 'client', 'dist', 'index.html'));
        });
    }
} else {
    if (!useEJS) {
        app.use(express.static('client/src', 'src'));
        Router.get('/', (req, res) => {
            res.sendFile(path.resolve(process.cwd(), 'client', 'index.html'));
        });
    } else {
        Router.get('/', (req, res) => {
            res.render('index', { user: GetSafeUser(req.user) });
        });
    }
}