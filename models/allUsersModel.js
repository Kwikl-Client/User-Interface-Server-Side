import mongoose from 'mongoose';

const UsersSchema = mongoose.Schema(
    { 
      email: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );
const usersModel = mongoose.model('users', UsersSchema, 'users');
export default usersModel;
