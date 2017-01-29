const express = require('express')
const app = express()

const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`listening to port *: ${PORT}. press ctrl + c to cancel`)
})
