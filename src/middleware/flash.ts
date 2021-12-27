import { NextFunction, Request, Response } from 'express'

declare module 'express-session' {
  export interface SessionData {
    flash?: {
      type: string
      intro: string
      message: string
    }
  }
}

export default function flash(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
}
