const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobileNumber: String,
  dob: String,
  gender: String,
  address: String,
  country: String,
  city: String,
  otherCity: Boolean,
  skills: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
