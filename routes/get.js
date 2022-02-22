const express = require('express');
const Router = express.Router();

const { db, GetSafeUser, settings } = require("../index.js");
const { ensureKey, ensurePerms } = require("../lib/apiManager")
const { paginate, fetchGifs } = require("../lib/util.js")
module.exports = Router;


const baseUrl = settings.get('baseUrl')


//fulltext (needs work probably - maybe just get titles/names for autocomplete)
Router.get('/api/find/:search', /*ensureKey,*/ async (req, res) => {
    let { search } = req.params;
    const nsfw = req.query.nsfw == 'true' || false;
    search = search.split(',');

    let gifs = await fetchGifs(search, nsfw);

    //filter info based on permissions (not working//TODO)
    if (req.user != null) {
        if (!req.user.permissions.includes('access_user')) {
            const allowedFields = ['username', 'avatar', 'joindate']
            gifs = gifs.map((a) => {
                let tempUser = {}
                for (const key in a.user) {
                    if (allowedFields.includes(key)) {
                        tempUser[key] = a.user[key];
                    } module.exports = Router;
                }

                delete a.user;
                a.user = tempUser;
                return a;
            });
        }
    }


    //removed user from this

    res.send({ gifs });
})
/*
//testing raw user data
Router.get('/raw/user', (req, res) => {
    res.send({ user: req.user })
})*/