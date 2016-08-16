'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Coordinate Schema
 */
var CoordinateSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Coordinate name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true,
    required: 'Fill in coordinate type.',
    default: 'youtube'
  },
  x: {
    type: String,
    trim: true,
    required: 'An X coordinate is required.'
  },
  y: {
    type: String,
    trim: true,
    required: 'An X coordinate is required.'
  },
  layer: {
    type: String,
    trim: true,
    required: 'A layer is required.',
    default: 'custom'
  },
  icon: {
    type: String,
    trim: true,
    required: 'An icon is required',
    default: 'combat'
  },
  description: {
    type: String,
    trim: true
  }
});

mongoose.model('Coordinate', CoordinateSchema);
