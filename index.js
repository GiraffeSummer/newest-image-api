require('dotenv').config();
const DEVELOPMENT = process.env.NODE_ENV != 'production';
const express = require('express');
const app = express();
const helmet = require("helmet");
const session = require('express-session');
const cors = require('cors');
const passport = require("passport");
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

const settings = require("./lib/settings");

const APPNAME = settings.get('appName');
const BaseDomain = "https://" + APPNAME + ".loca.lt";
const allowedOrigins = [BaseDomain, "https://google.com", "https://cdn.discordapp.com/",
    `http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`,
    "http://localhost:5000", "http://127.0.0.1:5000", settings.get('frontEndUrl')];

const db = require("./lib/db")();

function ensureAuthenticated(req, res, next) {
    const Authorized = req.isAuthenticated();
    if (Authorized) {
        return next();
    } else {
        res.redirect("/login")
    }
}

function ensurePerms(perms) {
    //check if user has permission to access endpoint
    return (req, res, next) => {
        if (DEVELOPMENT) { //unsafe for production, for production check in db if contains permissions
            const all_allowed = req.session.passport.user.permissions.includes('all_perms_allowed');
            if (all_allowed) return next();
        }

        let allowed = false;
        if (Array.isArray(perms)) {
            allowed = perms.every(p => req.session.passport.user.permissions.includes(p))
        } else {
            allowed = req.session.passport.user.permissions.includes(perms);
        }
        console.log('ensuring: ' + perms + ` ${allowed}`);

        if (allowed)
            return next();
        else {//reject
            return res.status(403).redirect("/login")//next();
        }
    }
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

function GetSafeUser(user, self = false) {
    if (user === undefined) return null;
    const safeUser = {
        username: user.username,
        color: user.color,
        avatar: user.avatar,
        joindate: user.joindate,
        userid: user.userid
    }

    //if it is itself
    if (self == true) {
        safeUser['permissions'] = user.permissions;
    }

    return safeUser;
}

//for custom applications idk might come in handy
function GetDataUser(user, items = ['username', 'userid']) {
    if (user === undefined) return null;
    if (!Array.isArray(items)) throw new Error("Not an array, items needs to be an array");

    let safeUser = {};
    items.forEach(element => {
        safeUser[element] = user[element];
    });

    return safeUser;
}

module.exports = {
    APPNAME,
    ensureAuthenticated,
    ensurePerms,
    passport,
    db,
    PORT,
    settings,
    GetSafeUser, GetDataUser,
    app
}

app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use('/gifs', express.static('./uploads'));
app.use('/global', express.static('./global'));
app.use(cors({
    /*origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        } return callback(null, true);
    },*/
    origin: allowedOrigins,
    credentials: true
}));

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "cdn.discordapp.com", "https:"],
                //  imgSrc: [],
                //   defaultSrc: ["'self'"],
                "default-src": ["'self'", "cdn.discordapp.com"]
            },
        },
    })
);

app.use(cookieParser(process.env.COOKIEKEY));
const SessionOpts = session({
    secret: process.env.COOKIEKEY,
    resave: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://' + process.env.MONGODB_URI, collection: 'sessions', ttl: 24 * 60 * 60 }),
    saveUninitialized: true,
    cookie: { secure: /*!DEVELOPMENT*/false/*This has to stay false, otherwise logins don't work*/, maxAge: 8 * 60 * 60 * 1000 }
})
app.use(SessionOpts);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(require("./lib/passport/discordStrategy"))

//app.use('/auth', require('./custom_routes/passportRoutes'))
require('./lib/routerLoader.js')(app);

// test multer errors
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
})

/*
db.schemas.Genre.create({
    name: 'Test',
});
*/

app.listen(PORT, () => {
    console.log(`${(DEVELOPMENT) ? 'Developing' : 'listening'} on http://localhost:${PORT}`);
})