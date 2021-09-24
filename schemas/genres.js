const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: require('./users')
    },
    date: { type: Date, default: Date.now() },
});

// Compile model from schema
const Genre = mongoose.model('Genres', schema);
module.exports = Genre;