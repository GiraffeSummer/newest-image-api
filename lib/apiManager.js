const DEVELOPMENT = process.env.NODE_ENV != 'production';
const { db, settings, passport } = require("../index.js");
const { log } = require('./logger');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit')


const ensureKey = passport.authenticate('bearer', { session: false })

function ensureAuthenticated(req, res, next) {
    const Authorized = req.isAuthenticated();
    if (Authorized) {
        return next();
    } else {
        res.redirect("/login")
    }
}


//fix for future
function limitAuthenticated(loggedIn = { mins: 10, max: 1000 }, notLoggedIn = { mins: 20, max: 1000 }) {
    const rateObject = {
        windowMs: 20 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false,
    }
    if (req.isAuthenticated()) {
        //logged in
        rateObject.windowMs = loggedIn.mins * 60 * 1000;
        rateObject.max = loggedIn.max;
        return rateLimit(rateObject)
    }
    else {
        //not logged in
        rateObject.windowMs = notLoggedIn.mins * 60 * 1000;
        rateObject.max = notLoggedIn.max;
        return rateLimit(rateObject)
    }
}

//should check db instead of session
function ensurePerms(perms) {
    //check if user has permission to access endpoint
    return async (req, res, next) => {

        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        let usingKey = req.user.usingKey == true;
        if (DEVELOPMENT && !usingKey) { //unsafe for production, for production check in db if contains permissions
            const all_allowed = req.session.passport.user.permissions.includes('all_perms_allowed');
            if (all_allowed) return next();
        }

        let allowed = false;

        if (!usingKey) {
            if (Array.isArray(perms)) {
                allowed = perms.every(p => req.session.passport.user.permissions.includes(p))
            } else {
                allowed = req.session.passport.user.permissions.includes(perms);
            }
        } else {
            const key = await db.schemas.Keys.findOne({ key: req.user.key }).populate('holder');
            if (Array.isArray(perms)) {
                allowed = perms.every(p => key.permissions.includes(p))
            } else {
                allowed = key.permissions.includes(perms);
            }
        }
        console.log('ensuring: ' + perms + ` ${allowed} -using key: ${usingKey ? 'yes' : 'no'}`);

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