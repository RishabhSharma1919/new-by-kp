import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
const paymentrouter =express.Router();


paymentrouter.post("/process",processPayment)

export default paymentrouter
