const express = require('express');
const Router = express.Router();

const { db, GetSafeUser, settings, ensureAuthenticated, ensurePerms, } = require("../index.js");
const { ensureKey, generateKey } = require("../lib/apiManager")
module.exports = Router;

const baseUrl = settings.get('baseUrl')

Router.get('/api/key', ensureAuthenticated, ensurePerms(['api_access']), async (req, res) => {
    let key = await db.schemas.Keys.findOne({ holder: req.user._id })

    if (key == null || key == undefined) {
        key = await db.schemas.Keys.create({ holder: req.user._id, key: generateKey() })
    }


    res.json(key)
});