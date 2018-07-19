import { expect } from 'chai'
import app from '../app'
import supertest from 'supertest'

import { BASE_API_PATH } from '../../constants'

let server

const randomString = () => Math.random().toString(36).substring(7)

describe('server', () => {
  beforeEach(() => {
    server = app.listen('5678', () => {
      console.log('test app listening on port 5678')
    })
  })

  afterEach(() => {
    server.close()
  })

  describe('/', () => {
    it('should exist', async () => {
      const response = await supertest(app).get('/')
      expect(response.status).to.be.equal(200)
    })
  })

  describe('/register', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/register`)
        .send({ login: 'testLogin' })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property password is required.')
    })

    it('should not accept extra paramters', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/register`)
        .send({
          login: 'testLogin',
          password: 'abcd',
          extraProp: 'test'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should register user', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/register`)
        .send({
          login: `testLogin${randomString()}`,
          password: 'abcd'
        })

      const responseBody = JSON.parse(response.body)

      expect(response.status).to.be.equal(200)
      expect(responseBody.data).to.be.empty
    })
  })
})
