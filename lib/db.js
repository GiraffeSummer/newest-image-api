const fs = require('fs');
const mongoose = require('mongoose');
module.exports = () => {

    //Set up default mongoose connection
    const mongoDB = 'mongodb://' + process.env.MONGODB_URI;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    //Get the default connection
    const db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    LoadSchemas(db);

    console.log('Loaded Schemas: ' + Object.keys(db.schemas).join(', '))

    return db;
}

const blacklist_schemas = ['genres', 'permissions']/* add .js at the end so I don't have to: */.map(x => x + '.js');

function LoadSchemas(db) {
    db.schemas = {};
    const schemas = fs.readdirSync("./schemas/");
    schemas.forEach((file) => {
        if (!file.endsWith(".js") || blacklist_schemas.includes(file)) return;
        const name = file[0].toUpperCase() + file.substr(1, file.indexOf('.js') - 1);

        db.schemas[name] = require(`../schemas/${file}`);
    });
}