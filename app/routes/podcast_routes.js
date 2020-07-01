// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// require in podcast model
const Podcast = require('../models/podcast')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })
// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

// INDEX
// GET all podcasts
router.get('/podcasts', requireToken, (req, res, next) => {
  Podcast.find()
    .then(podcasts => {
      return podcasts.map(podcast => podcast.toObject())
    })
    .then(podcasts => res.status(200).json({ podcasts: podcasts }))
    .catch(next)
})

// SHOW
// allows user to GET a specific podcast
router.get('/podacasts/:id', requireToken, (req, res, next) => {
  Podcast.findbyId(req.params.id)
    .then(handle404)
    .then(podcast => res.status(200).json({ podcast: podcast.toObject() }))
    .catch(next)
})

// POST
// Create new podcast with owner
router.post('/podcasts', requireToken, removeBlanks, (req, res, next) => {
  req.body.podcast.owner = req.user.id
  Podcast.create(req.body.podcast)
    .then(podcast => {
      res.status(201).json({ podcast: podcast.toObject() })
    })
    .catch(next)
})

// PATCH
// Update podcast body properties
router.patch('/podcasts/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.podcast.owner

  Podcast.findById(req.params.id)
    .then(handle404)
    .then(podcast => {
      requireOwnership(req, podcast)
      return podcast.updateOne(req.body.podcast)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
// Owner is able to delete a podcast
router.delete('/podcasts/:id', requireToken, (req, res, next) => {
  Podcast.findbyId(req.params.id)
    .then(handle404)
    .then(podcast => {
      requireOwnership(req, podcast)
      podcast.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})
module.exports = router
