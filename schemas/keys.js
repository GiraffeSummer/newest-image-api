const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    key: String,
    uses: Number,
    creationdate: { type: Date, default: Date.now() },
    holder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: require('./users')
    },
    permissions: { type: Array, default: ['get'] }
});

// Compile model from schema
const Key = mongoose.model('Keys', schema);
module.exports = Key;