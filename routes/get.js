const express = require('express');
const Router = express.Router();

const { db, GetSafeUser, settings } = require("../index.js");
module.exports = Router;
/*
Router.get('/get', (req, res) => {
    res.render('get', { user: GetSafeUser(req.user) });
})*/
const baseUrl = settings.get('baseUrl')
Router.get('/find/:search', async (req, res) => {
    let { search } = req.params;
    const nsfw = req.query.nsfw == 'true' || false;

    search = search.split(',').map(x => x.trim().toLowerCase());

    
    const query = {
        $or: [
            { "name": { "$regex": search.join(' '), "$options": "i" } },
            { "originalname": { "$regex": search.join(' '), "$options": "i" } },
            { "tags": { "$in": [...search] } },
        ]
    }
    if(!nsfw) query.nsfw = false;
    const results = await db.schemas.Gifs.find(query).populate('user');
    let gifs = [];

    //make copy to unlink from schemas
    results.forEach(r => {
        //need to improve this, reference object without linking
        let x = JSON.parse(JSON.stringify(r));
        x.user = GetSafeUser(x.user, false);//fix path
        x.url = baseUrl + x.path;
        delete x.path;
        //return x;
        gifs.push(x);
    });

    //filter info based on permissions (not working//TODO)
    if (req.user != null) {
        if (!req.user.permissions.includes('access_user')) {
            const allowedFields = ['username', 'avatar', 'joindate']
            gifs = gifs.map((a) => {
                let tempUser = {}
                for (const key in a.user) {
                    if (allowedFields.includes(key)) {
                        tempUser[key] = a.user[key];
                    }
                }

                delete a.user;
                a.user = tempUser;
                return a;
            });
        }
    }

    //console.log(results);



    res.send({ user: GetSafeUser(req.user, true), gifs });
});

Router.get('/data/user', (req, res) => {
    res.json({ user: GetSafeUser(req.user, true) })
})
/*
//testing raw user data
Router.get('/raw/user', (req, res) => {
    res.send({ user: req.user })
})*/