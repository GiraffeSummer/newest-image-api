const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userid: String,
    email: String,
    color: String,//banner_color
    username: String,
    avatar: { type: String, default: `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png` },
    verified: Boolean,
    joindate: { type: Date, default: Date.now() },
    permissions: { type: Array, default: [] }
});

// Compile model from schema
const User = mongoose.model('Users', schema);
module.exports = User;
