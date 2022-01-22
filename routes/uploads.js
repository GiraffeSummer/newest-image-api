const PATH = require('path')
const express = require('express');
const Router = express.Router();
const { storage, multer } = require('../lib/multer');
const mongoose = require('mongoose');
const { log } = require('../lib/logger');

const filters = require('../lib/fileFilters');
const maxTags = 20;//10

const { passport, db, GetSafeUser } = require("../index.js");
const { ensurePerms, ensureAuthenticated, ensureKey } = require("../lib/apiManager")

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
Router.get('/upload',  ensurePerms(['upload']), (req, res) => {
    res.render('upload', { user: GetSafeUser(req.user, true) });
});*/

Router.get('/user/file-uploads', ensurePerms(['upload']), async (req, res) => {
    const nsfw = req.query.nsfw == 'true' || false;
    const { uploads, nsfwResults } = await GetUserUploads(req.user._id, nsfw);
    res.send({ user: { ...GetSafeUser(req.user, true), _id: req.user._id }, uploads })
})

Router.get('/user/uploads/:id', ensurePerms(['upload', 'access_user']), async (req, res) => {
    let user = await db.schemas.Users.findOne({ _id: req.params.id });
    const nsfw = req.query.nsfw == 'true' || false;

    const { uploads, nsfwResults } = await GetUserUploads(user._id, nsfw);
    res.send({ user: GetSafeUser(req.user, true), uploader: GetSafeUser(user), uploads, nsfwResults })
})

async function GetUserUploads(id, nsfw = false) {
    const query = (nsfw) ? { user: { _id: id } } : { nsfw: false, user: { _id: id } };
    const uploads = await db.schemas.Gifs.find(query)
    const nsfwResults = (nsfw) ? undefined : await db.schemas.Gifs.count({ ...query, nsfw: true });
    return { uploads, nsfwResults };
}

function CleanTags(tags) {
    return tags.split(',')
        .map(x => x.trim().toLowerCase())
        .filter(i => i != '')
        .filter((item, pos, a) => a.indexOf(item) == pos)
    //haha stupid long line
}

Router.post('/update-upload/:id', ensurePerms(['upload']), async (req, res) => {
    const { id: _id } = req.params;
    const { changes, new: newData } = req.body;
    const update = {};
    if ([changes.nsfw, changes.tags, changes.name].every(x => x == false)) {
        return res.send({ status: 'failed', message: 'nothing different' })
    }
    if (changes.nsfw) update.nsfw = newData.nsfw;
    if (changes.tags) update.tags = CleanTags(newData.tags).slice(0, maxTags);
    if (changes.name) update.name = newData.name;

    let result = await db.schemas.Gifs.findOneAndUpdate({ _id }, update);

    log('update-upload:success', req.user._id, { changes, update, result });

    res.send({ status: 'ok', result })
})

Router.delete('/update-upload/:id', ensurePerms(['upload']), async (req, res) => {
    const { id: _id } = req.params;
    const confirmed = req.body.confirm;


    if (!confirmed) {
        log('delete-upload:failed', req.user._id, { confirmed });
        return res.send({ status: 'failed', message: 'nothing different' })
    }
    const toDelete = await await db.schemas.Gifs.findOne({ _id });
    let result = await db.schemas.Gifs.deleteOne({ _id });

    log('delete-upload:success', req.user._id, { id: _id, result: toDelete });

    res.send({ status: 'ok', result })
})

//requires {name,file,nsfw,tags}
Router.post('/upload', ensurePerms(['upload']), gifUpload, async (req, res) => {
    const file = req.file;

    if (file === undefined) {
        //req.flash({status: 'failed'})
        return res.send({ status: 'failed' })/*res.render('upload', { status: "failed", file, user: GetSafeUser(req.user, true) })*/
    }

    const result = await db.schemas.Gifs.create({
        name: req.body.name,
        originalname: file.originalname,
        filename: file.filename,
        path: '/gifs/' + file.filename,
        size: file.size,
        nsfw: req.body.nsfw == 'on',
        user: new mongoose.Types.ObjectId(req.user._id),
        tags: CleanTags(req.body.tags)
    })

    log('upload:success', req.user._id, { body: req.body, file, result });

    //do this through client side:
    //res.render('upload', { status: "ok", file, user: GetSafeUser(req.user, true) })
    res.send({ status: "ok" })
    //req.flash(req.origin)
});

Router.post('/upload/key', async (req, res) => {
    console.log(req.body)
    const file = req.body.file;

    if (file === undefined) {
        //req.flash({status: 'failed'})
        return res.send({ status: 'failed' })/*res.render('upload', { status: "failed", file, user: GetSafeUser(req.user, true) })*/
    }

    const result = await db.schemas.Gifs.create({
        name: req.body.name,
        originalname: file.originalname,
        filename: file.filename,
        path: '/gifs/' + file.filename,
        size: file.size,
        nsfw: req.body.nsfw == 'on',
        user: new mongoose.Types.ObjectId(req.user._id),
        tags: CleanTags(req.body.tags)
    })

    log('upload:success', req.user._id, { body: req.body, file, result });

    //do this through client side:
    //res.render('upload', { status: "ok", file, user: GetSafeUser(req.user, true) })
    res.send({ status: "ok" })
    //req.flash(req.origin)
});