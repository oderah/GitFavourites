const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const fetch = require('node-fetch')
const token = '3a0f44d626c72e72bebe6615667211c87aadfc91'

const app = express()
const bodyParser = require('body-parser')

const ALL_FAVOURITES_QUERY = 'SELECT * FROM Favourites'

// mysql connection object
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'GitFavs'
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

connection.connect(err => {
  if (err) {
    throw err
  }
})

// / endpoint used to search github api'
app.post('/', (req, res) => {
  let response = res

  // query to search github graphql api
  let query = `query {
    search(query:"${req.body.keyword}", type:REPOSITORY, first:10){
      repositoryCount
      edges {
        node {
          ... on Repository {
            nameWithOwner
            primaryLanguage {
              name
            }
            releases(last: 1) {
             edges {
              node {
                tag {
                  name
                }
              }
            }
            }
          }
        }
      }
    }
  }`

  // fetch results from api
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {'Authorization': `Bearer ${token}`},
    body: JSON.stringify({query})
  }).then(res => res.json())
  .then(res => response.send(res.data))
  .catch(err => console.log(err))
})

// /favourites endpoint used for requesting user's favourite repos
app.get('/favourites', (req, res) => {
  // query database
  connection.query(ALL_FAVOURITES_QUERY, (err, results) => {
    if (err) {
      throw err
    }

    res.json({
      data: results
    })
  })
})

// endpoint for updating favourites
app.post('/favourites', (req, res) => {
  let query = ''

  if (req.body.request === 'add') {
    query = `
      insert into Favourites (name, language, tag) values ('${req.body.name}', '${req.body.language}', '${req.body.tag}');
    `
  }
  else if (req.body.request === 'remove') {
    query = `
      delete from Favourites where name = '${req.body.name}';
    `
  }

  // query database
  connection.query(query, (err, results) => {
    if (err) {
      // throw err
      res.json({
        err: err
      })
    }

    res.send({data: results})
  })
})

app.listen(7000, () => {
  console.log(`Backend api listening on port 7000...`)
})
