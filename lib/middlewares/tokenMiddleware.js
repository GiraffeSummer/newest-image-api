const { generateKey } = require("../apiManager")

const applyToken = (req, res, next) => {
    req.session.token = req.sessionID + "." + generateKey();
    next();
}
module.exports = { applyToken };