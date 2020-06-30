const mongoose = require('mongoose')

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  hosts: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Podcast', podcastSchema)
