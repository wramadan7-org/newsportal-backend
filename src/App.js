const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
// memanggil env
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// import routes
const userRoute = require('./routes/users')
const categoryRoute = require('./routes/categories')
const newsRoute = require('./routes/news')

// routing
app.use('/users', userRoute)
app.use('/category', categoryRoute)
app.use('/news', newsRoute)
app.use('/uploads', express.static('src/assets/uploads'))
// menampilkan file/image ke web dengan cara http://localhost:8080/uploads(nama root diatas)/fanatic.jpg(naama file)

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running well'
  })
})

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
