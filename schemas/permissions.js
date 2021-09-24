const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    action: String
});

// Compile model from schema
const Key = mongoose.model('Permissions', schema);
module.exports = Key;