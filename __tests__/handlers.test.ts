import { NextFunction, Request, Response } from 'express'
import * as handlers from '../src/handlers'

test('home page renders', () => {
  const req = {}
  const res = { render: jest.fn() }
  handlers.home(req as Request, res as unknown as Response)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('home')
})

test('about page renders', () => {
  const req = {}
  const res = { render: jest.fn() }
  handlers.about(req as Request, res as unknown as Response)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('about')
  expect(res.render.mock.calls[0][1]).toEqual(
    expect.objectContaining({ fortune: expect.stringMatching(/\W/) }),
  )
})

test('404 handlers renders', () => {
  const req = {}
  const res = { render: jest.fn() }
  handlers.notFound(req as Request, res as unknown as Response)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('404')
})

test('500 handlers renders', () => {
  const err = new Error('some error')
  const req = {}
  const res = { render: jest.fn() }
  const next: NextFunction = () => {}
  handlers.serverError(err, req as Request, res as unknown as Response, next)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('500')
})
