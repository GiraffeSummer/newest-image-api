"# newest-image-api" 

WORK IN PROGRESS

this is an image api for anime reaction gifs for my discord bot (and maybe other's)
it allows custom uploads from users, you can login with discord.

I have a cool permissions system.

current push just is the main upload and get functionality

TODO:
 - edit uploads
 - edit permissions (for admins (`manage_user`))
 - better frontend (svelte)
 - more to come


/client is WIP svelte front end

current front end is made with ejs, as I wanted it to work

feel free to suggest or send a PR

.env template:
```env
MONGODB_URI=localhost:27017/ImageApi
COOKIEKEY=hmmmm_cookies
NODE_ENV=dev#production
PORT=3000

DISCORD_CLIENT=
DISCORD_SECRET=
```