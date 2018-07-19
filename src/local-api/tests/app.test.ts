import { expect } from 'chai'
import app from '../app'
import supertest from 'supertest'

let server

describe('server', () => {
  beforeEach(() => {
    server = app.listen('5678', () => {
      console.log('test app listening on port 5678')
    })
  })

  afterEach(() => {
    server.close()
  })

  describe('path /', () => {
    it('should exist', async () => {
      const response = await supertest(app).get('/')
      expect(response.status).to.be.equal(200)
    })
  })
})
