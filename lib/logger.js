const { db } = require("../index.js");

/**
 * 
 * @param {String} logtype type of log 
 * @param {User _id} user _id of user performing the action
 * @param {*} data data to log to message
 */
const log = async (logtype, user, data) => {
    // await db.schemas.Gifs.find(query).populate('user');
    if (!logtype.includes(':')) logtype = logtype + ':success';//if success, not included default to success
    const [type, status] = logtype.split(':')
    const logObj = { type, status, user: user, data: data };

    console.log(`Logging: ${type}:${status} from ${user}`)
    const result = await db.schemas.Logs.create(logObj);
    return result;
}
const getLog = async (filter, filterField) => {
    //ex: filter: GiraffeSummer ; filterField: user.username
    if (filterField.toLowerCase().startsWith('user.')) {
        //query on the user
        const param = filterField.split('.')[1];
        const user = await db.schemas.Users.findOne({ [param]: filter })
    }
    const query = {};
    /*const query = {
         $or: [
             { "name": { "$regex": search.join(' '), "$options": "i" } },
             { "originalname": { "$regex": search.join(' '), "$options": "i" } },
         ]
     }*/
    const result = await db.schemas.Logs.find(query).populate('user');
    return result;
}
module.exports = { log, getLog }