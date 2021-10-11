const PATH = require('path')
const express = require('express');
const Router = express.Router();
const { storage, multer } = require('../lib/multer');
const mongoose = require('mongoose');

const filters = require('../lib/fileFilters');

const { ensureAuthenticated, passport, db, ensurePerms, GetSafeUser } = require("../index.js");

module.exports = Router;

const gifUpload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = PATH.extname(file.originalname);
        if (ext !== '.gif' && file.mimetype != "image/gif") {
            return callback(new Error('Only gifs are allowed'))
        }
        callback(null, true)
    }
}).single('gif');
/*
Router.get('/upload', ensureAuthenticated, ensurePerms(['upload']), (req, res) => {
    res.render('upload', { user: GetSafeUser(req.user, true) });
});*/

Router.get('/user/uploads', ensureAuthenticated, ensurePerms(['upload']), async (req, res) => {
    const uploads = await GetUserUploads(req.user._id)
    res.send({ user: GetSafeUser(req.user, true), uploads })
})

Router.get('/user/uploads/:id', ensureAuthenticated, ensurePerms(['upload', 'access_user']), async (req, res) => {
    let user = await db.schemas.Users.findOne({ userid: req.params.id });

    const uploads = await GetUserUploads(user._id)
    res.send({ user: GetSafeUser(req.user, true), uploader: GetSafeUser(user), uploads })
})

async function GetUserUploads(id) {
    return await db.schemas.Gifs.find({ user: { _id: id } })
}

function CleanTags(tags) {
    return tags.split(',')
        .map(x => x.trim().toLowerCase())
        .filter(i => i != '')
        .filter((item, pos, a) => a.indexOf(item) == pos)
        .slice(0, 9)//haha stupid long line
}

Router.post('/update-upload/:id', ensureAuthenticated, ensurePerms(['upload']), async (req, res) => {
    const { id: _id } = req.params;
    const { changes, new: newData } = req.body;
    const update = {};
    if ([changes.nsfw, changes.tags, changes.name].every(x => x == false)) {
        return res.send({ status: 'failed', message: 'nothing different' })
    }
    if (changes.nsfw) update.nsfw = newData.nsfw;
    if (changes.tags) update.tags = CleanTags(newData.tags);
    if (changes.name) update.name = newData.name;

    let result = await db.schemas.Gifs.findOneAndUpdate({ _id }, update);
    res.send({ status: 'ok', result })
})

Router.post('/upload', ensureAuthenticated, ensurePerms(['upload']), gifUpload, (req, res) => {
    const file = req.file;

    if (file === undefined) {
        //req.flash({status: 'failed'})
        return res.send({ status: 'failed' })/*res.render('upload', { status: "failed", file, user: GetSafeUser(req.user, true) })*/
    }

    db.schemas.Gifs.create({
        name: req.body.name,
        originalname: file.originalname,
        filename: file.filename,
        path: '/gifs/' + file.filename,
        size: file.size,
        nsfw: req.body.nsfw == 'on',
        user: new mongoose.Types.ObjectId(req.user._id),
        tags: CleanTags(req.body.tags)
    })

    //do this through client side:
    //res.render('upload', { status: "ok", file, user: GetSafeUser(req.user, true) })
    res.send({ status: "ok" })
    //req.flash(req.origin)
});