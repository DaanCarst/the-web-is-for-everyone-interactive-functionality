// Importeer express uit de node_modules map
import express, { json, response } from 'express'

const baseURL = 'https://api.vervoerregio-amsterdam.fdnd.nl/api/v1'
const checklistSlug = '/principes'
const urlSlug = '/urls'
const websiteSlug = '/websites'

const url = baseURL + checklistSlug

const url_data = await fetch(baseURL + urlSlug + '?first=100'). then((response) => response.json())
const website_data = await fetch(baseURL + websiteSlug). then((response) => response.json())
const data = await fetch(url). then((response) => response.json())

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine en geef de 'views' map door
app.set('view engine', 'ejs')
app.set('views', './views')

// Stel afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('toolboard', data)
})

// Maak een route voor de toolboard
app.get('/partner', function (req, res) {
  res.render('partners', {url_data, data, website_data, active: '/partner'})
})

app.get('/contact', function (req, res) {
  res.render('contact')
})

// Maak een route voor de form
app.get('/form', function (req, res) {
  res.render('form', {website_data, active: '/form'})
})

// haalt post data op
app.post('/form', function(req, res) {
  const formURL = baseURL + urlSlug
  postJson(formURL, req.body).then((data) => {
    let newURL = { ... req.body }
    console.log(JSON.stringify(data))
    if (data.data) {
      res.redirect('/') 
    } else {
      const errormessage = `${req.body.url}: URl bestaat al.`
      const newdata = { error: errormessage, values: newURL }
      
      res.render('form', {newdata, website_data, active: '/form' })
    }
  })
})

// Stel het poortnummer in waar express op gaat luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}