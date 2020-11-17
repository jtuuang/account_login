const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const isUser = require('./isUser')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const result = isUser(email, password)

  if (!result) return res.render('index', { result: !result })
  if (result) return res.render('welcome', { result })
})

app.listen(3000, () => {
  console.log('The server is running on http://localhost:3000')
})