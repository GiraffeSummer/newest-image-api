const Permissions = require('./permissions');
const PermissionKeys = Object.keys(Permissions);

function CleanObject(obj, filter, invert = false) {
    let temp = {}
    for (const key in obj) {
        if (filter.includes(key) == !invert) {
            temp[key] = obj[key];
        }
    }
    return temp;
}

function HighestPermission(user) {
    let index = 0;
    user.permissions.forEach(p => {
        let i = PermissionKeys.indexOf(p);
        if (i > index) index = i;
    })

    return { index, permission: PermissionKeys[index] }
}

module.exports = { CleanObject, HighestPermission,PermissionKeys }