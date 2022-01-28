const express = require('express');
const path = require('path');
const Router = express.Router();

const { GetSafeUser, app } = require('../index');

module.exports = Router;

if (process.env.NODE_ENV === 'production') {
    console.log("Server running in production!");

    app.use(express.static('client/public'));
    app.use('/assets', express.static('client/dist/assets'));

    const routify_routes = require('../client/.routify/urlIndex.json');
    //adding the root extra
    const indexed = routify_routes.filter(x => x.endsWith('/index')).map(x => x.slice(0, -'index'.length)).filter(x => x != '/');

    Router.get(['/', ...indexed, ...routify_routes], (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'client', 'dist', 'index.html'));
    });

} else {
    app.use('/src', express.static('client/src'));
    Router.get('/', (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'client', 'index.html'));
    });
}