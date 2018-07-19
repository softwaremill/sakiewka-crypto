export default (requestBody: object, model: object) => {
  const modelProperties = Object.keys(model)
  const requestProperties = Object.keys(requestBody)

  const errors = []

  requestProperties.forEach((reqestProp: string) => {
    if (!model[reqestProp]) errors.push(`Property ${reqestProp} is not supported.`)
  })

  modelProperties.forEach((modelProperty: string) => {
    if (!requestBody[modelProperty] && model[modelProperty].required) {
      errors.push(`Property ${modelProperty} is required.`)
    }
  })

  return errors
}
