const fs = require('fs');
const invalid = [];
module.exports = (app) => {
    const routes = fs.readdirSync("./routes/");
    routes.forEach((file) => {
        if (!file.endsWith(".js")) return;

        const route = require(`../routes/${file}`);
        try {
            const listeners = route.stack.map(r => { return r.route.path });
            console.log(`Loading: ${file} endpoints: [${listeners.join(', ')}]`);
            app.use(route);
        } catch (error) {
            invalid.push(file);
        }
    });
    if (invalid.length > 0) console.log('Failed: - ' + invalid.join(', '))
}