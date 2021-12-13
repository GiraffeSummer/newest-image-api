
const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const { log } = require('../lib/logger');
const Permissions = require('../lib/permissions');

const { passport, db, GetSafeUser, settings } = require("../index.js");
const { ensurePerms, ensureAuthenticated } = require("../lib/apiManager")

const { CleanObject, HighestPermission, PermissionKeys } = require("../lib/functions.js");

const perms = CleanObject(Permissions, ['member', 'none', 'download', 'all_perms_allowed'], true)

module.exports = Router;

Router.get('/user/all/content', ensurePerms(['manage_user']), async (req, res) => {
    const currentUser = await db.schemas.Users.findOne({ _id: req.user._id });
    let users = JSON.parse(JSON.stringify(await db.schemas.Users.find({})))

    const HighestPerm = HighestPermission(currentUser);

    const allowedFields = ['username', 'avatar', 'permissions', 'joindate', '_id'];

    users = users.filter(x => HighestPermission(x).index < HighestPerm.index);
    users = users.map(user => CleanObject(user, allowedFields))
    users = [CleanObject(currentUser, allowedFields), ...users]

    res.send({ user: GetSafeUser(req.user, true), users })
})

Router.get('/user/all', ensurePerms(['manage_user']), async (req, res) => {
    const currentUser = await db.schemas.Users.findOne({ _id: req.user._id });
    const fullPerms = currentUser.permissions.includes('read_users');
    let users = JSON.parse(JSON.stringify(await db.schemas.Users.find({})))

    const HighestPerm = HighestPermission(currentUser);

    if (!fullPerms) {
        const allowedFields = ['username', 'avatar', 'joindate', 'permissions', '_id']
        //filter out stuff like email
        users = users.map(user => CleanObject(user, allowedFields))
            .filter(x => HighestPermission(x).index < HighestPerm.index);
    } else users = users.filter(x => HighestPermission(x).index <= HighestPerm.index);

    res.send({ user: GetSafeUser(req.user, true), PermissionKeys, permissions: perms, users })
})

Router.post('/user/:id', ensurePerms(['manage_user']), async (req, res) => {
    const currentUser = await db.schemas.Users.findOne({ _id: req.user._id });
    const user = await db.schemas.Users.findOne({ _id: req.params.id });
    if (currentUser == null || user == null || HighestPermission(currentUser).index < HighestPermission(user).index) return res.send({ status: 'failed' })

    const permissions = Object.entries(req.body.permissions).filter(o => {
        const key = o[0];
        const value = o[1];
        if (value) return key
    }).map(o => o[0]);//very ugly I know, it works though
    const doc = JSON.parse(JSON.stringify(await db.schemas.Users.findOneAndUpdate({ _id: user._id }, { permissions })))

    const allowedFields = ['username', 'avatar', 'joindate', 'permissions', '_id']
    doc.permissions = permissions;

    log('update-user:success', req.user._id, { user, newperms: permissions });

    res.send({ success: true, status: 'ok', user: GetSafeUser(req.user, true), permissions: perms, newuser: CleanObject(doc, allowedFields) })
})