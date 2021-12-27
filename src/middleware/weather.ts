import { NextFunction, Request, Response } from 'express'

const getWeatherData = () => {
  return [
    {
      location: {
        name: 'Portland',
      },
      forecastUrl: 'https://api.weather.gov/gridpoints/PQR/112,103/forecast',
      iconUrl: 'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
      weather: 'Chance Showers And Thunderstorms',
      temp: '59 F',
    },
    {
      location: {
        name: 'Bend',
      },
      forecastUrl: 'https://api.weather.gov/gridpoints/PDT/34,40/forecast',
      iconUrl: 'https://api.weather.gov/icons/land/day/tsra_sct,50?size=medium',
      weather: 'Scattered Showers And Thunderstorms',
      temp: '51 F',
    },
    {
      location: {
        name: 'Manzanita',
      },
      forecastUrl: 'https://api.weather.gov/gridpoints/PQR/73,120/forecast',
      iconUrl: 'https://api.weather.gov/icons/land/day/tsra,90?size=medium',
      weather: 'Showers And Thunderstorms',
      temp: '55 F',
    },
  ]
}

/**
 * Express middleware for a weather widget
 *
 * @param {Request} _req - Request
 * @param {Response} res - Response
 * @param {NextFunction} next - NextFunction
 */
export default function weatherMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!res.locals.partials) res.locals.partials = {}
  res.locals.partials.weatherContext = getWeatherData()
  next()
}
