const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error(req.fileValidationError), false);
    }
    cb(null, true);
};

const gifFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(gif|GIF)$/)) {
        req.fileValidationError = 'Only gif files are allowed!';
        return cb(new Error(req.fileValidationError), false);
    }
    cb(null, true);
};
module.exports = { imageFilter, gifFilter };