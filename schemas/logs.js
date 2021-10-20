const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    data: { type: Object, default: {} },
    date: { type: Date, default: Date.now() }
});

const Log = mongoose.model('Logs', schema);
module.exports = Log;