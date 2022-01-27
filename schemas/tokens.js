const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    token: String,
    creationdate: { type: Date, default: Date.now() },
    permissions: { type: Array, default: ['download'] }
});

// Compile model from schema
const token = mongoose.model('Token', schema);
module.exports = token;