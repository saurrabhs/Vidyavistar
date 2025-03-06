const mongoose = require('mongoose');

const branchCutoffSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true
  },
  cutoffs: {
    OPEN: Number,
    SC: Number,
    ST: Number,
    VJ: Number,
    NT1: Number,
    NT2: Number,
    NT3: Number,
    OBC: Number,
    EWS: Number,
    TFWS: Number
  }
});

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    city: String,
    district: String,
    state: String
  },
  type: {
    type: String,
    enum: ['Government', 'Private', 'Aided', 'Autonomous'],
    required: true
  },
  autonomyStatus: {
    type: String,
    enum: ['Autonomous', 'Non-Autonomous'],
    default: 'Non-Autonomous'
  },
  accreditation: {
    type: String,
    default: 'NA'
  },
  establishedYear: Number,
  website: String,
  contact: {
    email: String,
    phone: String
  },
  branches: [branchCutoffSchema],
  facilities: [String],
  rankings: {
    NIRF: Number,
    other: Map
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient searching
collegeSchema.index({ 'branches.branchName': 1 });
collegeSchema.index({ 'branches.cutoffs.OPEN': 1 });
collegeSchema.index({ 'location.city': 1 });
collegeSchema.index({ type: 1 });

const College = mongoose.model('College', collegeSchema);

module.exports = College;
