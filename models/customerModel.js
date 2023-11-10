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
  },
  {
    timestamps: true,
  }
);
//to hide password
// CustomerSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     delete ret.password;
//     return ret;
//   },
// });
const customerModel = mongoose.model('customers', CustomerSchema, 'customers');

export default customerModel;
