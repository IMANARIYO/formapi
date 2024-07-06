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
const handleFileUploads = async (req, newObject) => {
  const uploadPromises = [];

  if (req.files) {
    if (req.files.receipt) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.receipt[0].path)
          .then((result) => (newObject.receipt = result.secure_url))
      );
    }

    if (req.files.agreement) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.agreement[0].path)
          .then((result) => (newObject.agreement = result.secure_url))
      );
    }

    if (req.files.landDocument) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.landDocument[0].path)
          .then((result) => (newObject.landDocument = result.secure_url))
      );
    }

    if (req.files.idOrPassport) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.idOrPassport[0].path)
          .then((result) => (newObject.idOrPassport = result.secure_url))
      );
    }
  }

  await Promise.all(uploadPromises);
};



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
// export const createBuyer = catchAsync(async (req, res) => {
//   let newObject = {...req.body}

//    // Array to store promises for file uploads
//   const uploadPromises = [];

//   // Check if req.files exists and handle each file upload
//   if (req.files) {
//     // Upload receipt file if available
//     if (req.files.receipt) {
//       uploadPromises.push(
//         cloudinary.uploader.upload(req.files.receipt[0].path)
//           .then((result) => newObject.receipt = result.secure_url)
//       );
//     }

//     // Upload agreement file if available
//     if (req.files.agreement) {
//       uploadPromises.push(
//         cloudinary.uploader.upload(req.files.agreement[0].path)
//           .then((result) => newObject.agreement = result.secure_url)
//       );
//     }

//     // Upload landDocument file if available
//     if (req.files.landDocument) {
//       uploadPromises.push(
//         cloudinary.uploader.upload(req.files.landDocument[0].path)
//           .then((result) => newObject.landDocument = result.secure_url)
//       );
//     }

//     // Upload idOrPassport file if available
//     if (req.files.idOrPassport) {
//       uploadPromises.push(
//         cloudinary.uploader.upload(req.files.idOrPassport[0].path)
//           .then((result) => newObject.idOrPassport = result.secure_url)
//       );
//     }
//   }


//   await Promise.all(uploadPromises);

//   console.log("-----------------",req.body)
//   const result = await Buyer.create(newObject)
//   res.status(201).json({
//     status: 'success',
//     message: 'Buyer created successfully',
//     data: result
//   })
// })
// Update status of Seller to 'approved'
export const approveSeller = catchAsync(async (req, res) => {
  const result = await Seller.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(`Seller not found with ID: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    message: "Seller status updated to approved",
    data: result,
  });
});
// CRUD handlers for Buyer
export const createBuyer = catchAsync(async (req, res) => {
  let newObject = { ...req.body };

  await handleFileUploads(req, newObject);

  const result = await Buyer.create(newObject);
  res.status(201).json({
    status: "success",
    message: "Buyer created successfully",
    data: result,
  });
});
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
// Update status of Buyer to 'approved'
export const approveBuyer = catchAsync(async (req, res) => {
  const result = await Buyer.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(`Buyer not found with ID: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    message: "Buyer status updated to approved",
    data: result,
  });
});
// Create or update function for Seller
// CRUD handlers for Seller
export const createSeller = catchAsync(async (req, res) => {
  let newObject = { ...req.body };

  // Array to store promises for file uploads
  const uploadPromises = [];

  // Check if req.files exists and handle each file upload
  if (req.files) {
    if (req.files.receipt) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.receipt[0].path)
          .then((result) => newObject.receipt = result.secure_url)
      );
    }

    if (req.files.agreement) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.agreement[0].path)
          .then((result) => newObject.agreement = result.secure_url)
      );
    }

    if (req.files.landDocument) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.landDocument[0].path)
          .then((result) => newObject.landDocument = result.secure_url)
      );
    }

    if (req.files.idOrPassport) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.idOrPassport[0].path)
          .then((result) => newObject.idOrPassport = result.secure_url)
      );
    }
  }

  await Promise.all(uploadPromises);

  const result = await Seller.create(newObject);

  res.status(201).json({
    status: 'success',
    message: 'Seller created successfully',
    data: result
  });
});


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
  let updatedObject = { ...req.body };

  // Array to store promises for file uploads
  const uploadPromises = [];

  // Check if req.files exists and handle each file upload
  if (req.files) {
    if (req.files.receipt) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.receipt[0].path)
          .then((result) => updatedObject.receipt = result.secure_url)
      );
    }

    if (req.files.agreement) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.agreement[0].path)
          .then((result) => updatedObject.agreement = result.secure_url)
      );
    }

    if (req.files.landDocument) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.landDocument[0].path)
          .then((result) => updatedObject.landDocument = result.secure_url)
      );
    }

    if (req.files.idOrPassport) {
      uploadPromises.push(
        cloudinary.uploader.upload(req.files.idOrPassport[0].path)
          .then((result) => updatedObject.idOrPassport = result.secure_url)
      );
    }
  }

  await Promise.all(uploadPromises);

  // Update the seller directly in the database
  const result = await Seller.findByIdAndUpdate(req.params.id, updatedObject, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Seller updated successfully',
    data: result,
  });
});


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
