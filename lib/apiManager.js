const DEVELOPMENT = process.env.NODE_ENV != 'production';
const { db, settings } = require("../index.js");
const { log } = require('./logger');
const crypto = require('crypto');

async function ensureKey(req, res, next) {
    const origin = req.get('origin') // (req.get('origin') !== undefined) ? [req.get('origin')] : ['http://' + req.get('host'), 'https://' + req.get('host')];
    const sameOrigin = origin == settings.get('frontEndUrl').slice(0, -1)


    const key = req.header('key');//temp
    if (key != undefined) {//temp

        //  if (!sameOrigin) {//
        //const key = req.header('key');
        //if (key == undefined) {
        if (false) {//temp
            return res.status(403).send({ message: `No 'key' header found.` });
        } else {
            const KeyResult = await db.schemas.Keys.findOne({ key }).populate('holder');
            if (KeyResult == null) {
                log(`api_accessed:failed`, null, { path: req.path, key });
                return res.status(403).send({ message: 'Invalid key: ' + key });
            } else {
                await db.schemas.Keys.updateOne({ key }, { $set: { uses: KeyResult.uses + 1 } });
                log(`api_accessed`, KeyResult.holder, { path: req.path, ...{ doc: KeyResult._doc }.doc });
                //weird way of doing it, but it works!
                return next();
            }
        }
    } else
        return next();
}

function ensureAuthenticated(req, res, next) {
    const Authorized = req.isAuthenticated();
    if (Authorized) {
        return next();
    } else {
        res.redirect("/login")
    }
}

function ensurePerms(perms) {
    //check if user has permission to access endpoint
    return async (req, res, next) => {

        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        if (DEVELOPMENT) { //unsafe for production, for production check in db if contains permissions
            const all_allowed = req.session.passport.user.permissions.includes('all_perms_allowed');
            req.usingKey = false;
            if (all_allowed) return next();
        }

        let allowed = false;

        /*let usingKey = Object.keys(req.headers).includes('key');
        console.log(req.headers)
        req.usingKey = usingKey;
        if (!usingKey) {*/
        if (Array.isArray(perms)) {
            allowed = perms.every(p => req.session.passport.user.permissions.includes(p))
        } else {
            allowed = req.session.passport.user.permissions.includes(perms);
        }
        /*
    } else {
        const key = req.headers.get('key');
        console.log(key)
        const keys = await db.schemas.Keys.find({key}).populate('user');
        //console.log(keys)
    }*/
        console.log('ensuring: ' + perms + ` ${allowed}`);

        if (allowed)
            return next();
        else {//reject
            return res.status(403).redirect("/login")//next();
        }
    }
}

function generateKey() {
    const token = crypto.randomUUID();
    return token;
}

module.exports = {
    ensureAuthenticated,
    ensurePerms,
    ensureKey,
    generateKey
}