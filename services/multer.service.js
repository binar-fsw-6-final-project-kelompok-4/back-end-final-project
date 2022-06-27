const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync('./public/data/uploads')) {
            cb(null, './public/data/uploads')
        } else {
            fs.mkdirSync('./public/data/uploads', {
                recursive: true
            })
            cb(null, './public/data/uploads')
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

module.exports = storage