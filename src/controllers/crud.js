import dotenv from "dotenv";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";
import { Buyer, ContactUs, Seller } from "../models/customerModel.js";

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const createOrUpdateBuyer = async (req, res, isUpdate = false) => {
  let newObject = {...req.body}
  if (req.file) {
    
  }
  try {
    if (isUpdate) {
      let documentToUpdate = await Buyer.findById(req.params.id)
      if (!documentToUpdate) {
        throw new AppError(`Buyer not found with ID: ${req.params.id}`, 404)
      }
      documentToUpdate.set(newObject)
      return await documentToUpdate.save()
    } else {
      const newBuyer = await Buyer.create(newObject)
      console.log(newObject)
      return newBuyer
    }
  } catch (error) {
    throw new AppError(error.message, 400)
  }
}

export const getAllBuyers = catchAsync(async (req, res) => {
  const buyers = await Buyer.find();
  res.status(200).json({
    status: 'success',
    message: 'All buyers retrieved successfully',
    data: buyers
  });
});
export const getAllSellers = catchAsync(async (req, res) => {
  const sellers = await Seller.find();
  res.status(200).json({
    status: 'success',
    message: 'All sellers retrieved successfully',
    data: sellers
  });
});
export const getAllContactMessages = catchAsync(async (req, res) => {
  const contactMessages = await ContactUs.find();
  res.status(200).json({
    status: 'success',
    message: 'All contact messages retrieved successfully',
    data: contactMessages
  });
});

// CRUD handlers for Buyer
export const createBuyer = catchAsync(async (req, res) => {
  let newObject = {...req.body}
  if (req.files && req.files.receipt) {
 
    newObject.receipt = (await cloudinary.uploader.upload(
      req.files.Receipt[0].path
    )).secure_url
  }

  if (req.files && req.files.agreement) {
    newObject.agreement = (await cloudinary.uploader.upload(
      req.files.agreement[0].path
    )).secure_url
    console.log("fg----",newObject.agreement)
  }
  if (req.files &&req.files.landDocument) {
  
    newObject.landDocument = (await cloudinary.uploader.upload(
      req.files.landDocument[0].path
    )).secure_url 
  }
  if (req.files && req.files.idOrPassport) {
    newObject.idOrPassport = (await cloudinary.uploader.upload(
      req.file.idOrPassport[0].path
    )).secure_url
  }

  

  console.log("-----------------",req.body)
  const result = await Buyer.create(newObject)
  res.status(201).json({
    status: 'success',
    message: 'Buyer created successfully',
    data: result
  })
})

export const getBuyerById = catchAsync(async (req, res) => {
  const buyer = await Buyer.findById(req.params.id)
  if (!buyer) {
    throw new AppError(`Buyer not found with ID: ${req.params.id}`, 404)
  }
  res.status(200).json({
    status: 'success',
    message: 'Buyer retrieved successfully',
    data: buyer
  })
})

export const updateBuyer = catchAsync(async (req, res) => {
  const result = await createOrUpdateBuyer(req, res, true)
  res.status(200).json({
    status: 'success',
    message: 'Buyer updated successfully',
    data: result
  })
})

export const deleteBuyer = catchAsync(async (req, res) => {
  await Buyer.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: 'success',
    message: 'Buyer deleted successfully'
  })
})

// Helper function to handle file upload fields
const uploadFiles = async req => {
  let newObject = { ...req.body }

  if (req.files) {

    if (req.files && req.files.Receipt) {
      const Receipt = req.files.Receipt[0] // Assuming saving path or URL
      newObject.Receipt = (await cloudinary.uploader.upload(
        req.files.Receipt[0].path
      )).secure_url
    }

    if (req.files && req.files.agreement) {
   
      newObject.agreement = (await cloudinary.uploader.upload(
        req.files.agreement[0].path
      )).secure_url
    }

    if (req.files && req.files['ID/Passport']) {
  
      newObject.idOrPassport = (await cloudinary.uploader.upload(
        req.files['ID/Passport'][0].path
      )).secure_url
    }

    if (req.files.LandDocument) {
 
      newObject.landDocument = (await cloudinary.uploader.upload(
        req.files.landDocument[0].path
      )).secure_url
    }
  }

  return newObject
}

// Create or update function for Seller
const createOrUpdateSeller = async (req, res, isUpdate = false) => {
  let newObject = uploadFiles(req)

  try {
    if (isUpdate) {
      let documentToUpdate = await Seller.findById(req.params.id)
      if (!documentToUpdate) {
        throw new AppError(`Seller not found with ID: ${req.params.id}`, 404)
      }
      documentToUpdate.set(newObject)
      return await documentToUpdate.save()
    } else {
      const newSeller = await Seller.create(newObject)
      return newSeller
    }
  } catch (error) {
    throw new AppError(error.message, 400)
  }
}

// CRUD handlers for Seller
export const createSeller = catchAsync(async (req, res) => {
  const result = await createOrUpdateSeller(req, res)
  res.status(201).json({
    status: 'success',
    message: 'Seller created successfully',
    data: result
  })
})

export const getSellerById = catchAsync(async (req, res) => {
  const seller = await Seller.findById(req.params.id)
  if (!seller) {
    throw new AppError(`Seller not found with ID: ${req.params.id}`, 404)
  }
  res.status(200).json({
    status: 'success',
    message: 'Seller retrieved successfully',
    data: seller
  })
})

export const updateSeller = catchAsync(async (req, res) => {
  const result = await createOrUpdateSeller(req, res, true)
  res.status(200).json({
    status: 'success',
    message: 'Seller updated successfully',
    data: result
  })
})

export const deleteSeller = catchAsync(async (req, res) => {
  await Seller.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: 'success',
    message: 'Seller deleted successfully'
  })
})
export const createContactUs = catchAsync(async (req, res) => {
  try {
    const newContactUs = await ContactUs.create(req.body)
    res.status(201).json({
      status: 'success',
      message: 'Contact message created successfully',
      data: newContactUs
    })
  } catch (error) {
    throw new AppError(error.message, 400)
  }
})

// Read function for ContactUs
export const getContactUsById = catchAsync(async (req, res) => {
  const contactMessage = await ContactUs.findById(req.params.id)
  if (!contactMessage) {
    throw new AppError(
      `Contact message not found with ID: ${req.params.id}`,
      404
    )
  }
  res.status(200).json({
    status: 'success',
    message: 'Contact message retrieved successfully',
    data: contactMessage
  })
})

// Update function for ContactUs
export const updateContactUs = catchAsync(async (req, res) => {
  try {
    const updatedContactMessage = await ContactUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    if (!updatedContactMessage) {
      throw new AppError(
        `Contact message not found with ID: ${req.params.id}`,
        404
      )
    }
    res.status(200).json({
      status: 'success',
      message: 'Contact message updated successfully',
      data: updatedContactMessage
    })
  } catch (error) {
    throw new AppError(error.message, 400)
  }
})

// Delete function for ContactUs
export const deleteContactUs = catchAsync(async (req, res) => {
  await ContactUs.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: 'success',
    message: 'Contact message deleted successfully'
  })
})
