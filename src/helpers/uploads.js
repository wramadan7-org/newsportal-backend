const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/uploads') // destination ini membaca dari folder project kita pertama, jadi harus lengkap
  },
  filename: (req, file, cb) => {
    //  const { id } = req.params
    const { title } = req.body
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1] // ambil type file (jpg/png)
    //  console.log('sassas', [file.originalname.split('.').length])
    const filename = new Date().getTime().toString().concat(title.split(' ').join('-')).concat('.').concat(ext)
    cb(null, filename)
  }
})

module.exports = multer({ storage }).single('image') // image adalah key untuk upload multer
