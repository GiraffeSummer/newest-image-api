
const { db, GetSafeUser, settings } = require("../index.js");
const baseUrl = settings.get('baseUrl')

/**
 * Paginate any array
 * @param {Array} content content to paginate
 * @param {Number} page the current page
 * @param {Number} limit the maximum number of items allowed on a page
 * @returns paginated object
 */
function paginate(content, page, limit) {
    let maxPages =
        content.length / limit < 1 ? 1 : Math.ceil(content.length / limit);

    let startIndex = limit * (page - 1) < 0 ? 0 : limit * (page - 1);
    let endIndex = limit * (page - 1) + limit;
    let items = content.slice(startIndex, endIndex);

    return {
        page,
        limit,
        items,
        maxPages
    }
}

async function fetchGifsPaginate(search, page, limit, nsfw = false) {

    search = search.map(x => x.trim().toLowerCase());

    let startIndex = limit * (page - 1) < 0 ? 0 : limit * (page - 1);
    let endIndex = limit * (page - 1) + limit;

    const query = {
        $or: [
            { "name": { "$regex": search.join(' '), "$options": "i" } },
            { "originalname": { "$regex": search.join(' '), "$options": "i" } },
            { "tags": { "$in": [...search] } },
        ]
    }
    if (!nsfw) {
        query.nsfw = false;
    }
    const results = await db.schemas.Gifs.find(query).skip(startIndex).limit(endIndex).populate('user');
    let gifs = [];

    //make copy to unlink from schemas
    results.forEach(r => {
        //need to improve this, reference object without linking
        let x = JSON.parse(JSON.stringify(r));
        x.user = GetSafeUser(x.user, false);//fix path
        x.url = encodeURI(baseUrl + x.path);
        delete x.path;
        //return x;
        gifs.push(x);
    });
    return gifs;
}

async function fetchGifs(search, nsfw = false) {
    search = search.map(x => x.trim().toLowerCase());

    const query = {
        $or: [
            { "name": { "$regex": search.join(' '), "$options": "i" } },
            { "originalname": { "$regex": search.join(' '), "$options": "i" } },
            { "tags": { "$in": [...search] } },
        ]
    }
    if (!nsfw) {
        query.nsfw = false;
    }
    const results = await db.schemas.Gifs.find(query).populate('user');
    let gifs = [];

    //make copy to unlink from schemas
    results.forEach(r => {
        //need to improve this, reference object without linking
        let x = JSON.parse(JSON.stringify(r));
        x.user = GetSafeUser(x.user, false);//fix path
        x.url = encodeURI(baseUrl + x.path);
        delete x.path;
        //return x;
        gifs.push(x);
    });
    return gifs;
}
module.exports = { paginate, fetchGifs, fetchGifsPaginate }