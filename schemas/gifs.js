const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    originalname: String,
    filename: String,
    path: String,
    size: Number,
    nsfw: Boolean,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users' //require('./users')
    },
    tags: { type: Array, default: [] },
    date: { type: Date, default: Date.now() },
});

//{name, path, filename, size,date,user }
// Compile model from schema
const Gif = mongoose.model('Gifs', schema);
module.exports = Gif;