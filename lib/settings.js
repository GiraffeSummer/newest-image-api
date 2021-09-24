const NeuDb = require('neudb');
const yaml = require('js-yaml');
const Permissions = require('./permissions');

const template = {
    appName: 'Image db',
    permissions: Permissions
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