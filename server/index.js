const axios = require('axios')
const cors = require('cors')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const API_KEY = '388a354784303036624e7053bed58821'
const LAT = 55.79
const LON = 37.58
const REFRESH_TIME = 600000 // 10 min

const app = express()

app.use(express.json())
app.options('*', cors())

const requestApiSendWeather = async socket => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&APPID=${API_KEY}`)

    socket.emit('api', {
      temp: response.data.main.temp,
      sky: response.data.weather[0].main
    })
  } catch (error) {
    console.error(error)
  }
}

const server = http.createServer(app)
const io = socketIo(server)

io.on('connection', socket => {
  console.log(`Connected ${socket.id}`)

  requestApiSendWeather(socket)
  console.log(`API requested and weather sent to ${socket.id}`)

  setInterval(() => {
    requestApiSendWeather(socket)
    console.log(`API requested and weather sent to ${socket.id}`)
  }, REFRESH_TIME)

  socket.on('disconnect', () => {
    console.log(`Disconnected ${socket.id}`)
  })
})

server.listen(4000)
