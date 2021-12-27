import { NextFunction, Request, Response } from 'express'
import multiparty from 'multiparty'
import fortune from './fortune'

// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$',
)

interface IUser {
  name: string
  email: string
}

class NewsletterSignup implements IUser {
  name: string
  email: string

  constructor(user: IUser) {
    this.name = user.name || ''
    this.email = user.email || ''
  }

  async save() {
    console.log(`saving data { name: ${this.name}, email: ${this.email} }`)
  }
}

export function home(_: Request, res: Response): void {
  res.cookie('monster', 'nom nom')
  res.cookie('signed_monster', 'nom nom', { signed: true })
  res.render('home')
}

export function about(_: Request, res: Response): void {
  res.render('about', { fortune: fortune() })
}

export function headers(req: Request, res: Response): void {
  res.type('text/plain')
  const headerList = Object.entries(req.headers).map(
    ([key, value]) => `${key} : ${value}`,
  )
  res.send(headerList.join('\n'))
}

export function sectionTest(_: Request, res: Response): void {
  res.render('section-test')
}

export function newsletterSignup(_req: Request, res: Response): void {
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}

/**
 * Processes a newsletter signup request.
 * After the request is processed, it will be redirected to thank-you page.
 *
 * @param {Request} req - Request
 * @param {Response} res - Response
 */
export function newsletterSignupProcess(req: Request, res: Response): void {
  const name = req.body.name || ''
  const email = req.body.email || ''

  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid.',
    }
    res.redirect(303, '/newsletter/signup')
    return
  }

  new NewsletterSignup({ name, email })
    .save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
      }
      return res.redirect(303, '/newsletter/archive')
    })
    .catch((_err: Error) => {
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      }
      return res.redirect(303, '/newsletter/archive')
    })
}

/**
 * A thank-you page which is displayed after the signup request is processed.
 *
 * @param {Request} _req - Request
 * @param {Response} res - Response
 */
export function newsletterArchive(_req: Request, res: Response): void {
  res.render('newsletter-archive')
}

/**
 * Signup page for the newsletter using ajax
 *
 * @param {Request} _req - Request
 * @param {Response} res - Response
 */
export function newsletterSignupAjax(_req: Request, res: Response): void {
  res.render('newsletter-signup-ajax', { csrf: 'CSRF token goes here' })
}

export function vacationPhotoContest(_req: Request, res: Response): void {
  const now = new Date()
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth(),
  })
}

export function vacationPhotoContestAjax(_req: Request, res: Response): void {
  const now = new Date()
  res.render('contest/vacation-photo-ajax', {
    year: now.getFullYear(),
    month: now.getMonth(),
  })
}

export function vacationPhotoContestProcess(req: Request, res: Response): void {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ errer: err.message })

    console.log('field data: ', fields)
    console.log('files: ', files)
    res.redirect(303, '/contest/vacation-photo-thank-you')
    return undefined
  })
}

export function notFound(_: Request, res: Response): void {
  res.status(404).render('404')
}

export function serverError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.log(err)
  res.status(500).render('500')
}

export namespace api {
  export function newsletterSignup(req: Request, res: Response): void {
    console.log(`CSRF token (from hidden form field): ${req.body.csrf}`)
    console.log(`Name (from visible form field): ${req.body.name}`)
    console.log(`Email (from visible form field): ${req.body.email}`)

    res.send({ result: 'success' })
  }

  export function vacationPhotoContest(req: Request, res: Response): void {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).send({ error: err.message })

      console.log('field data: ', fields)
      console.log('files: ', files)
      res.send({ result: 'success' })
      return undefined
    })
  }
}
