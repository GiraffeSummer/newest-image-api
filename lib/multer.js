const multer = require('multer');
const PATH = require('path');
const fs = require('fs');
const uploadsPath = PATH.join(process.cwd() + '/uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
        //TODO: better "random" filenames
        const savePath = file.fieldname + '-' + file.originalname + '-' + Date.now() + PATH.extname(file.originalname);
        file.savePath = savePath;
        cb(null, savePath);
    }
})
const upload = multer({ storage })

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}
module.exports = { upload, storage, multer };