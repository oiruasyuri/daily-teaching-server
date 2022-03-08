const express = require('express')
var cors = require('cors')
const requestPromise = require('request-promise')
const cheerio = require('cheerio')

const messianicURL = 'https://www.messianica.org.br'

const app = express()

app.use(cors())

app.get('/daily-teaching', async (request, response) => {
  const { date } = request.query
  const [ day, month, year ] = date.split('/')

  const requestPromiseSettings = {
    url: `${messianicURL}/escrito-divino?d=${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`,
    transform: (body) => { return cheerio.load(body) }
  }

  const teaching = await requestPromise(requestPromiseSettings)
    .then(($) => {
      return {
        name: $('.calendar-card__content-title').html(),
        content: $('#wa-conteudo.post__content').html(),
        audio_url: messianicURL + $('audio#player source').attr('src'),
      }
    })
    .catch((error) => { return console.error(error) })

  response.status(200).json(teaching)
})

app.listen(3333, () => { console.log('Server is running on port 3333')})