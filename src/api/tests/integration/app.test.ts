import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { BASE_API_PATH } from '../../../common/constants'

let server

const randomString = () => Math.random().toString(36).substring(7)

const getUser = async () => {
  const login = `testlogin${randomString()}`

  // first register new user
  await supertest(app)
    .post(`/${BASE_API_PATH}/user/register`)
    .send({
      login,
      password: 'abcd'
    })

  // then logs him in and get token
  const response = await supertest(app)
    .post(`/${BASE_API_PATH}/user/login`)
    .send({
      login,
      password: 'abcd'
    })

  const responseBody = JSON.parse(response.body)
  return {
    login,
    token: responseBody.data.token
  }
}

describe('server', () => {
  beforeEach(() => {
    server = app.listen('5678', () => {})
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

  describe('/user/register', () => {
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
          login: `testlogin${randomString()}`,
          password: 'abcd'
        })

      const responseBody = JSON.parse(response.body)

      expect(response.status).to.be.equal(200)
      expect(responseBody.data).to.be.empty
    })
  })

  describe('/user/login', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/login`)
        .send({ login: 'testLogin' })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property password is required.')
    })

    it('should not accept extra paramters', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/login`)
        .send({
          login: 'testLogin',
          password: 'abcd',
          extraProp: 'test'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should login user', async () => {
      const login = `testlogin${randomString()}`

      // first registers new user
      await supertest(app)
        .post(`/${BASE_API_PATH}/user/register`)
        .send({
          login,
          password: 'abcd'
        })

      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/user/login`)
        .send({
          login,
          password: 'abcd'
        })

      const responseBody = JSON.parse(response.body)

      expect(response.status).to.be.equal(200)
      expect(responseBody.data.token).to.be.a('string')
      expect(responseBody.data.token).to.have.lengthOf(64)
    })
  })

  describe('/user/info', () => {
    it('should not accept request with missing header', async () => {
      const response = await supertest(app)
        .get(`/${BASE_API_PATH}/user/info`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Request header Authorization is required.')
    })

    it('should fetch user info', async () => {
      const { token, login } = await getUser()

      const response = await supertest(app)
        .get(`/${BASE_API_PATH}/user/info`)
        .set('Authorization', `Bearer ${token}`)

      const responseBody = JSON.parse(response.body)

      expect(response.status).to.be.equal(200)
      expect(responseBody.data.email).to.be.equal(login)
      expect(responseBody.data.token).to.have.lengthOf(64)
      expect(responseBody.data.tokenInfo.expiry).to.be.a('string')
    })
  })

  describe('/btc/wallet/create', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer abc`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property label is required.')
    })

    it('should not accept extra parameters', async () => {
      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer abc`)
        .send({
          label: 'testLabel',
          passphrase: 'aaa',
          userPubKey: '123',
          backupPubKey: '142',
          extraProp: 'abcd'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should create wallet', async () => {
      const { token, login } = await getUser()

      const response = await supertest(app)
        .post(`/${BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          label: 'testLabel',
          passphrase: 'aaa',
          userPubKey: '123'
        })

      const responseBody = JSON.parse(response.body)

      expect(response.status).to.be.equal(200)
      expect(responseBody.data.id).to.have.lengthOf(64)
      expect(responseBody.data.servicePubKey).to.be.a('string')
    })
  })
})
