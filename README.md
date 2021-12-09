"# Gif monkey" 

WORK IN PROGRESS

this is an image api for anime reaction gifs for my discord bot (and maybe other's)
it allows custom uploads from users, you can login with discord.

I have a cool permissions system.

current push just is the main upload and get functionality

TODO:
 - better scalibilty in admin, my uploads, and find pages
    like putting things on different pages, make user finder searchable (my uploads)
 - search option in user uploads page to easily find specific gifs
 - search users on admin page
 - API documentation
 - show query on find page
 - autofill tags on find search bar
 - add api key infrastructure

UPCOMING (maybe)
 - list of user activities like
   - most recent registered
   - most uploads
   - most nsfw  uploads ? 
 - styling upgrades
 - better mobile
 - search suggestion
 - better way to be used as a platform, and less raw API
   - share url (or something)

feel free to suggest or send a PR

.env template:
```env
MONGODB_URI=localhost:27017/gifmonkey
COOKIEKEY=hmmmm_cookies
NODE_ENV=dev#production
PORT=3000

DISCORD_CLIENT=
DISCORD_SECRET=
```

don't forget `/client/.env`
```env
VITE_backend=http://localhost:3000
#Production:
#VITE_backend=""
```