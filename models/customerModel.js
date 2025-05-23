import mongoose from 'mongoose';

const SubscriptionDetailSchema = mongoose.Schema({
  sessionId: { type: String },
  packageType: { 
    type: String, 
    enum: ['monthly', 'yearly', 'jumbo'],
  },
  subscriptionId: { type: String },
}, { _id: false });

const ReviewSchema = mongoose.Schema({
  starRating: { type: Number },
  reviewText: { type: String },
  profession: { type: String },
}, { _id: false });

const GameLevelSchema = mongoose.Schema({
  level: { type: String, required: true }, // e.g., "1", "2", "5" for Level 1, Level 2, Level 5
  played: { type: Boolean, default: false },
}, { _id: false });

const CustomerSchema = mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },

    stripeDetails: [{ 
      sessionId: { type: String }, 
      timestamp: { type: Date, default: Date.now },
      packageType: { 
        type: String, 
        enum: ['monthly', 'yearly'], 
      }
    }],    

    subscriptionDetails: [{ 
      sessionId: { type: String }, 
      timestamp: { type: Date, default: Date.now },
      packageType: { 
        type: String, 
        enum: ['monthly', 'yearly', 'jumbo'], 
      }
    }],   

    phoneNumber: { type: String },
    country: { type: String },
    isDeleted: { type: Boolean, default: false },
    amtPaid: { type: Number },
    customId: { type: String },

    customerType: {
      type: String,
      enum: ['admin', 'reader', 'member', 'follower', 'star'],
      default: 'reader'
    },

    helpMessage: { type: String },

    joinCommunityStatus: {
      type: String,
      enum: ['not raised', 'raised', 'accepted', 'declined'],
      default: 'not raised'
    },

    talkToStarStatus: {
      type: String,
      enum: ['not raised', 'raised', 'paid', 'declined', 'meeting completed', 'meeting to be scheduled', 'meeting cancelled'],
      default: 'not raised'
    },

    gameLevelsPlayed: [GameLevelSchema], // Tracks which game levels the user has played

    lastHelpMessageSentAt: { type: Date, default: null },
    registeredCustomer: { type: String },
    reviews: [ReviewSchema],
    isAdmin: { type: Boolean, default: false },
    isEarlyBird: { type: Boolean, default: false },
    policyAccepted: { type: Boolean, default: true },

    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      branchName: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre('save', function (next) {
  if (this.subscriptionDetails && this.isModified('subscriptionDetails')) {
    this.joinCommunityStatus = 'accepted';
  }
  next();
});

CustomerSchema.pre('save', function (next) {
  const last6Digits = this._id.toString().slice(-6);
  this.customId = last6Digits;
  next();
});

CustomerSchema.pre('save', function (next) {
  if (this.joinCommunityStatus === 'accepted') {
    this.customerType = 'member';
  }
  next();
});

const customerModel = mongoose.model('customers', CustomerSchema, 'customers');

export default customerModel;
