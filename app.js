const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')

const isUser = require('./isUser')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressSession({
  secret: 'secret key',
  cookie: { maxAge: 10 * 1000 }
}))

app.get('/', (req, res) => {
  if (req.session.name) {
    res.render('welcome', { result: req.session.name })
  } else {
    res.render('index')
  }
})

app.get('/login', (req, res) => {
  if (req.session.name) {
    res.render('welcome', { result: req.session.name })
  } else {
    res.redirect('/')
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const result = isUser(email, password).firstName

  if (!result) return res.render('index', { result: !result })
  if (result) {
    req.session.name = result
    res.render('welcome', { result })
  }
})

app.post('/', (req, res) => {
  req.session.name = null
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('The server is running on http://localhost:3000')
})