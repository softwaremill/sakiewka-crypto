// @ts-ignore
jest.mock('cross-fetch')

import crossFetch from 'cross-fetch'
import { expect } from 'chai'

import { createHttpClient } from '../httpClient'
import { fail } from 'assert';

// @ts-ignore
const { Response, Headers } = jest.requireActual('cross-fetch')
const httpClient = createHttpClient(() => '')

describe('request', () => {
  it('should exist', () => {
    expect(httpClient.request).to.be.a('function')
  })

  it('should return proper error message when server returns internal error', async () => {
    // @ts-ignore
    crossFetch.mockResolvedValueOnce(new Response(
      JSON.stringify({
        errors: [{ message: 'test error', code: 'test code' }]
      }),
      { status: 500, statusText: '', headers: new Headers({ "Content-type": "json" }) }
    ))

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    try {
      await httpClient.request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.errors[0].message).to.eq('test error')
      expect(err.errors[0].code).to.eq('test code')
    }
  })

  it('should return proper error message when server returns error without body', async () => {
    // @ts-ignore
    crossFetch.mockResolvedValueOnce(new Response(
      '',
      { status: 400, statusText: 'BadRequest' }
    ))

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    try {
      await httpClient.request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.errors[0].message).to.eq('BadRequest')
    }
  })

  it('should return proper error message when server returns error with text-plain body', async () => {
    // @ts-ignore
    crossFetch.mockResolvedValueOnce(new Response(
      "Something went wrong",
      { status: 400, statusText: 'BadRequest', headers: new Headers({ "Content-type": "text" }) }
    ))

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    try {
      await httpClient.request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.errors[0].message).to.eq('Something went wrong')
    }
  })
})
