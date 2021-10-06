const express = require('express');
const Router = express.Router();

const { db, GetSafeUser } = require("../index.js");

module.exports = Router;

Router.get('/get', (req, res) => {
    res.render('get', { user: GetSafeUser(req.user) });
})

Router.get('/find/:search', async (req, res) => {
    let { search } = req.params;

    search = search.split(',').map(x => x.trim().toLowerCase());

    const query = {
        $or: [
            { "name": { "$regex": search.join(' '), "$options": "i" } },
            { "originalname": { "$regex": search.join(' '), "$options": "i" } },
            { "tags": { "$in": [...search] } },
        ]
    }
    const results = await db.schemas.Gifs.find(query).populate('user');

    //console.log(results);

    res.send({ user: GetSafeUser(req.user), gifs: results.map(x => { x.user = GetSafeUser(x.user); return x; }) });
});

Router.get('/data/user', (req, res) => {
    res.send({ user: GetSafeUser(req.user) })
})

Router.get('/raw/user', (req, res) => {
    res.send({ user: req.user })
})