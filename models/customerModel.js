import mongoose from 'mongoose';

const CustomerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    stripeDetails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const customerModel = mongoose.model('customers', CustomerSchema, 'customers');

export default customerModel;
