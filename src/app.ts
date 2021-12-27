import express from 'express'
import expressHandlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'

import * as handlers from './handlers'
import weather from './middleware/weather'
import flash from './middleware/flash'
import credentials from './credentials/development.json'

/**
 * Express application instance.
 */
const app: express.Application = express()

app.engine(
  'hbs',
  expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
      section(name: string, options: { fn: (arg: string) => string }) {
        if (!this.sections) this.sections = {}

        this.sections[name] = options.fn(this)
      },
    },
  }),
)

app.set('view engine', 'hbs')

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser(credentials.cookieSecret))
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
  }),
)

// Custom middlewares
app.use(weather)
app.use(flash)

app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/headers', handlers.headers)
app.get('/section-test', handlers.sectionTest)

// browser-based form submission
app.get('/newsletter/signup', handlers.newsletterSignup)
app.post('/newsletter/signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter/archive', handlers.newsletterArchive)

// fetch/JSON form submission
app.get('/newsletter-signup-ajax', handlers.newsletterSignupAjax)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.post(
  '/contest/vacation-photo/:year/:month',
  handlers.vacationPhotoContestProcess,
)
app.get('/contest/vacation-photo-thank-you', (_req, res) =>
  res.render('contest/vacation-photo-thank-you'),
)

app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)
app.post(
  '/api/vacation-photo-ajax/:year/:month',
  handlers.api.vacationPhotoContest,
)

// Static file hosting
app.use(express.static(`${__dirname}/../../public`))

// Error Handling
app.use(handlers.notFound)
app.use(handlers.serverError)

export default app
