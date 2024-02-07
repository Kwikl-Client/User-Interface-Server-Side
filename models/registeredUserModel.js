import mongoose from 'mongoose';

const RegisteredUserSchema = mongoose.Schema(
    {
        phoneNumber: {
        type: String,
      
      },
      country: {
        type: String,
      },
      dob: {
        type: Date,
      },
      gender: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
const registeredUserModel = mongoose.model('Registeredcustomers', RegisteredUserSchema, 'Registeredcustomers');
export default registeredUserModel;
