import * as nodeFetch from 'node-fetch'
import { expect } from 'chai'

import request from '../request'
import { fail } from 'assert';

describe('request', () => {
  it('should exist', () => {
    expect(request).to.be.a('function')
  })

  it('should return proper error message when server returns internal error', async () => {
    // @ts-ignore
    nodeFetch.default = jest.fn(() => {
      return Promise.resolve(new nodeFetch.Response(
        JSON.stringify({
          error: {
            message: 'test error'
          }
        }),
        { status: 500, statusText: '', headers: new nodeFetch.Headers({ "Content-type": "json" }) }
      ))
    })

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    //@ts-ignore
    try {
      await request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.message).to.eq('"test error"')
    }
  })

  it('should return proper error message when server returns error without body', async () => {
    // @ts-ignore
    nodeFetch.default = jest.fn(() => {
      return Promise.resolve(new nodeFetch.Response('',
        { status: 400, statusText: 'BadRequest'}
      ))
    })

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    try {
      await request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.message).to.eq('"BadRequest"')
    }
  })

  it('should return proper error message when server returns error with text-plain body', async () => {
    // @ts-ignore
    nodeFetch.default = jest.fn(() => {
      return Promise.resolve(new nodeFetch.Response("Something went wrong",
        { status: 400, statusText: 'BadRequest',headers: new nodeFetch.Headers({ "Content-type": "text" })  }
      ))
    })

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 123'
      }
    }
    try {
      await request(`http://localhost:8081/api/v1/x`, options)
      fail("Error was not thrown")
    } catch (err) {
      expect(err.message).to.eq('"Something went wrong"')
    }
  })
})
