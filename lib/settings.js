const NeuDb = require('neudb');
const yaml = require('js-yaml');

const template = {
    appName: 'Image db',
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
    frontEndUrl: 'http://localhost:5000/'
}

const db = new NeuDb({
    data: template,
    filePath: process.cwd() + '/settings',
    customParser: {
        enabled: true,
        stringify: yaml.dump,
        parser: yaml.load,
        ext: 'yaml'
    }
})

module.exports = db;