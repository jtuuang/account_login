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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.get('/', (req, res) => {
  if (req.session.firstName) {
    res.render('welcome', { result: req.session })
  } else {
    res.render('index')
  }
})

app.get('/login', (req, res) => {
  if (req.session.firstName) {
    res.render('welcome', { result: req.session })
  } else {
    res.redirect('/')
  }
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const result = isUser(email, password)

  if (!result) return res.render('index', { result: !result })
  if (result) {
    req.session.firstName = result.firstName
    res.render('welcome', { result })
  }
})

app.post('/', (req, res) => {
  req.session.firstName = null
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('The server is running on http://localhost:3000')
})