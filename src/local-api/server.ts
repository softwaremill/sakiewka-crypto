import app from './app'

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Sakiewka-client server is running at http://localhost${port}`)
})

export default server
