const { db, settings } = require("../index.js");
const { log } = require('./logger');
const crypto = require('crypto');

async function ensureKey(req, res, next) {
    const origin = [req.get('origin')] || ['http://' + req.get('host'), 'https://' + req.get('host')];
    const sameOrigin = origin.includes(settings.get('frontEndUrl').slice(0, -1))
    console.log(origin, sameOrigin)
    if (!sameOrigin) {
        const key = req.header('key');
        if (key == undefined) {
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

function generateKey() {
    const token = crypto.randomUUID();
    return token;
}

module.exports = {
    ensureKey,
    generateKey
}