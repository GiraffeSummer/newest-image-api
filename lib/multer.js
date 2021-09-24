const multer = require('multer')
const PATH = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PATH.join(process.cwd() + '/uploads'))
    },
    filename: function (req, file, cb) {
        const savePath = file.fieldname + '-' + file.originalname + '-' + Date.now() + PATH.extname(file.originalname);
        file.savePath = savePath;
        cb(null, savePath);
    }
})
const upload = multer({ storage })
module.exports = { upload, storage, multer };