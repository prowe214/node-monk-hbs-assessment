var routes = require('routes')()
var fs = require('fs')
var db = require('monk')('localhost/songs')
var qs = require('qs')
var songs = db.get('songs')
var view = require('mustache')
var mime = require('mime')

routes.addRoute('/songs', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    songs.find({}, (err, docs) => {
      if (err) res.end('404 error on the updown')
      var file = fs.readFileSync('templates/songs/index.html')
      var template = view.render(file.toString(), {songs: docs})
      res.end(template)
    })
  }
  if (req.method === 'POST') {
    var data = ''

    req.on('data', function (chunk) {
      data += chunk
    })

    req.on('end', function () {
      var song = qs.parse(data)
      songs.insert(song, function (err, doc) {
        if (err) res.end('error inserting')
        res.writeHead(302, {'Location': '/songs'})
        res.end()
      })
    })
  }
})

routes.addRoute('/songs/new', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    fs.readFile('./templates/songs/new.html', function (err, file) {
      if (err) res.end('error loading new')
      res.end(file.toString())
    })
  }
})

routes.addRoute('/songs/:id/delete', (req, res, url) => {
  if (req.method === 'POST') {
    songs.remove({_id: url.params.id}, function (err, doc) {
      if (err) res.end('error deleting')
      res.writeHead(302, {'Location': '/songs'})
      res.end()
    })
  }
})

routes.addRoute('/songs/:id', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    songs.findOne({_id: url.params.id}, function (err, doc) {
      var file = fs.readFileSync('./templates/songs/show.html')
      var template = view.render(file.toString(), {songs: doc})
      if (err) res.end('error showing that doc')
      res.end(template)
    })
  }
})

routes.addRoute('/public/*', (req, res, url) => {
  res.setHeader('Content-Type', mime.lookup(req.url))
  fs.readFile('.' + req.url, function (err, file) {
    if (err) {res.end('error loading style')}
    res.end(file)
  })
})

module.exports = routes
