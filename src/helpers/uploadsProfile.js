const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/uploads') // destination ini membaca dari folder project kita pertama, jadi harus lengkap
  },
  filename: (req, file, cb) => {
    //  const { id } = req.params
    const { name } = req.body
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1] // ambil type file (jpg/png)
    //  console.log('sassas', [file.originalname.split('.').length])
    const filename = new Date().getTime().toString().concat(name.split(' ').join('-')).concat('.').concat(ext)
    cb(null, filename)
  }
})

module.exports = multer({ storage }).single('photo') // image adalah key untuk upload multer
