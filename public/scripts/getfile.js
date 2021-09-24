const search = document.querySelector('#search');
let filterLinks = true;//document.querySelector("#betterLink").checked;
const codeBlock = document.querySelector("#code");

const colorizeBox = document.querySelector("#colorize");


const btn = document.querySelector("button#searchBtn");
btn.addEventListener("click", getData);


//thanks to https://jsfiddle.net/unLSJ/
const prettyPrintJson = {
    replacer: (match, pIndent, pKey, pVal, pEnd) => {
        let key = '<span class=json-key>';
        let val = '<span class=json-value>';
        let str = '<span class=json-string>';
        let r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    },
    prettyPrint: (obj) => {
        let jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, prettyPrintJson.replacer);
    }
};

function getData() {
    const colorize = colorizeBox.checked;
    console.log('finding data...');
    fetch(`/find/${search.value}`).then(a => a.json()).then(data => {

        //clean up object
        data.gifs = data.gifs.map(a => { delete a._id; delete a.__v; return a; })

        if (/*filterLinks &&*/ !colorize) {

            for (let i = 0; i < data.gifs.length; i++) {
                data.gifs[i].path = `<a href='${data.gifs[i].path}'>${data.gifs[i].name}</a>`
            }
            //make avatar link
            data.gifs = data.gifs.map(a => { a.user.avatar = `<a href='${a.user.avatar}'>${a.user.avatar}</a>`; return a })
        }

        if (!data.user?.permissions.includes('access_user')) {
            data.gifs = data.gifs.map(a => { a.user = { username: a.user.username, avatar: a.user.avatar, joindate: a.user.joindate }; return a })
        }

        const findOutput = document.querySelector("#output")
        let output = (findOutput) ? findOutput : document.createElement("pre")
        if (!findOutput) {
            output.id = "output";
            codeBlock.appendChild(output)
        }
        output.innerHTML = (colorize) ? prettyPrintJson.prettyPrint(data.gifs) : JSON.stringify(data.gifs, null, 2);
    })
}