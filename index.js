const express = require('serverless-express/express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/', (req, res) => {
  res.send('api')
})

app.get('/api/a', (req, res)=>{
  res.send('hello, a!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
