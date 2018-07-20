import { Request } from 'express'
import { RequestModel } from '../types/api'

export default (request: Request, model: RequestModel) => {
  const modelProperties = Object.keys(model.fields)
  const requestProperties = Object.keys(request.body)

  const errors = []

  requestProperties.forEach((reqestProp: string) => {
    if (!model.fields[reqestProp]) errors.push(`Property ${reqestProp} is not supported.`)
  })

  modelProperties.forEach((modelProperty: string) => {
    if (!request.body[modelProperty] && model.fields[modelProperty].required) {
      errors.push(`Property ${modelProperty} is required.`)
    }
  })

  model.headers.forEach((modelHeader: string) => {
    if (!request.headers[modelHeader]) {
      errors.push(`Request header ${modelHeader} is required.`)
    }
  })

  return errors
}
