import mongoose from "mongoose";

// Customer Schema
const customerSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  nationality: {
    type: String
  },
  identification: {
    type: String
  },
  passport: {
    type: Number
  },
  purposeOfVisit: {
    type: String
  },
  durationOfStay: {
    type: Number
  },
  dateOfEntry: {
    type: Date
  },
  portOfEntry: {
    type: String
  },
  emailAddress: {
    type: String
  },
  phoneNumber: {
    type: String
  }
})

const Customer = mongoose.model('Customer', customerSchema)

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  idOrPassport: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  landDocument: {
    type: String // Assuming this is a file path or URL
  },
  amountReceived: {
    type: Number
  },
  agreement: {
    type: String // Assuming this is a file path or URL
  },
  codeFile: {
    type: String // Assuming this is a file path or URL
  },
  status: {
    type: String,
    default: 'pending' // Default status can be "pending"
  }
})

const Buyer = mongoose.model('Buyer', buyerSchema)

// Seller Schema
const sellerSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  idOrPassport: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  receipt: {
    type: String // Assuming this is a file path or URL
  },
  amountPaid: {
    type: Number
  },
  agreement: {
    type: String // Assuming this is a file path or URL
  },
  codeFile: {
    type: String // Assuming this is a file path or URL
  },
  status: {
    type: String,
    default: 'pending' // Default status can be "pending"
  }
})

const Seller = mongoose.model('Seller', sellerSchema)

// Contact Us Schema
const contactUsSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  message: {
    type: String
  }
})

const ContactUs = mongoose.model('ContactUs', contactUsSchema)

export { Customer, Buyer, Seller, ContactUs }
