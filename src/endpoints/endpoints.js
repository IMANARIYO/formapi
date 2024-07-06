import express from "express";
import { createBuyer, createContactUs, deleteBuyer, deleteContactUs, getAllBuyers, getAllContactMessages, getAllSellers, getBuyerById, getContactUsById, updateBuyer, updateContactUs } from "../controllers/crud.js";
import { createSeller, deleteSeller, getSellerById, updateSeller } from "../controllers/crud.js";
import { catchAsync } from "../middlewares/globaleerorshandling.js";
import { uploaded } from "../utils/multer.js";

// Define routers
export const buyersRouter = express.Router();
export const sellersRouter = express.Router();
export const contactUsRouter = express.Router();
// Routes for Buyers
buyersRouter.post('/buyers', uploaded, createBuyer);
buyersRouter.get('/buyers/:id', getBuyerById);
buyersRouter.put('/buyers/:id', uploaded, updateBuyer);
buyersRouter.delete('/buyers/:id', deleteBuyer);
buyersRouter.get('/buyers', getAllBuyers); // New route for getting all buyers

// Routes for Sellers
sellersRouter.post('/sellers', uploaded, createSeller);
sellersRouter.get('/sellers/:id', getSellerById);
sellersRouter.put('/sellers/:id', uploaded, updateSeller);
sellersRouter.delete('/sellers/:id', deleteSeller);
sellersRouter.get('/sellers', getAllSellers); // New route for getting all sellers

// Routes for ContactUs
contactUsRouter.post('/contact-us', createContactUs);
contactUsRouter.get('/contact-us/:id', getContactUsById);
contactUsRouter.put('/contact-us/:id', updateContactUs);
contactUsRouter.delete('/contact-us/:id', deleteContactUs);
contactUsRouter.get('/contact-us', getAllContactMessages);