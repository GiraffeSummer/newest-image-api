const DiscordStrategy = require('passport-discord').Strategy;
const { PORT, db, settings } = require('../../index');
const { log } = require('../logger');

const CALLBACK_URL = settings.get('baseUrl') + `/auth/discord/callback`;


function getUserAvatar(avatar, userid, discriminator) {
    if (avatar === undefined) {
        const index = discriminator % 5;
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`
    } else {
        const animated = avatar.startsWith('a_');
        return `https://cdn.discordapp.com/avatars/${userid}/${avatar}.${(animated) ? 'gif' : 'png'}`;
    }
}


module.exports = new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['identify', 'email'/*, 'guilds', 'guilds.join'*/]
},
    async (accessToken, refreshToken, profile, done) => {
        // asynchronous verification, for effect...
        process.nextTick(async function () {
            let User = await db.schemas.Users.findOne({ userid: profile.id })

            profile.username = profile.username + "#" + profile.discriminator;
            if (!User) {
                User = await db.schemas.Users.create({
                    userid: profile.id,
                    email: profile.email,
                    username: profile.username,
                    color: profile.banner_color,
                    avatar: getUserAvatar(profile.avatar, profile.id, profile.discriminator),
                    verified: profile.verified
                });
                //log new user
                log('newuser:success', User._id, User);
                console.log(`${profile.username} registered`);
            }

            User = await db.schemas.Users.findOneAndUpdate({ userid: profile.id }, {
                $set: {
                    access_token: accessToken,
                    refreshToken: refreshToken,
                    //updating user details:
                    email: profile.email,
                    username: profile.username,
                    color: profile.banner_color,
                    avatar: getUserAvatar(profile.avatar, profile.id, profile.discriminator),
                    verified: profile.verified
                }
            })
            //.then((User) => {                    console.log(User)                })
            return done(null, User);
        })
    });