const multer = require('multer')

const storage = multer.diskStorage({

    destination: function(req,file,cb){
        cb(null,'../public/prodImgs/')
    },
    filename: function(req,file,cb){
        const newName = Date.now() + '-' + Math.round(Math.random() * 100)
        cb(null,file.fieldname + '-' + newName)
    }
})
const upload = multer({storage: storage})

module.exports = upload;