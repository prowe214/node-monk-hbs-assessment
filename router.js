var routes = require('routes')(),
    fs = require('fs')

routes.addRoute('/songs', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {

  }
})

module.exports = routes
