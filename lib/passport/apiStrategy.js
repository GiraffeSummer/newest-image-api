const BearerStrategy = require('passport-http-bearer');
const { db, GetSafeUser } = require('../../index');
const { log } = require('../logger');

module.exports = new BearerStrategy(
    async (token, done) => {
        const key = await db.schemas.Keys.findOne({ key: token }).populate('holder');
        if (key == null) {
            log(`api_accessed:failed`, null, {/* path: req.path,*/ key });
            return done(null, false);
            //return res.status(403).send({ message: 'Invalid key: ' + key });
        } else {
            if (key.holder.permissions.includes('api_access')) {
                await db.schemas.Keys.updateOne({ key: key.key }, { $set: { uses: key.uses + 1 } });
                log(`api_accessed`, key.holder, { /*path: req.path,*/ ...{ doc: key._doc }.doc });
                return done(null, { ...GetSafeUser(key.holder), usingKey: true, key: key.key }, { scope: 'all' });
            } else {
                return done(null, false);
                //res.status(403).send({ message: 'Invalid key: ' + key });
            }
        }
    }
)