import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
  {
    starRating: { type: Number }, // Change the type to Number
    reviewText: { type: String },
    profession: { type: String },
  },
  { _id: false } // This ensures that _id field is not created for each review
);

const CustomerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    stripeDetails: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    amtPaid: {
      type: Number,
    },
    customId: {
      type: String
    },
    customerType: {
      type: String,
      enum: ['reader', 'level2', 'level3', 'level4'],
      default: 'reader'
    },
    joinCommunityStatus: {
      type: String,
      enum: ['not raised', 'raised', 'accepted', 'declined'],
      default: 'not raised'
    },
    refundStatus: {
      type: String,
      enum: ['not raised', 'raised', 'refunded', 'declined'],
      default: 'not raised'
    },
    refundPercent: {
      type: Number,
      enum: [100, 80, 0],
      default: 0
    },
    reviews: [ReviewSchema],

  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre('save', function (next) {
  const last6Digits = this._id.toString().slice(-6);
  this.customId = last6Digits;
  next();
});

const customerModel = mongoose.model('customers', CustomerSchema, 'customers');

export default customerModel;
