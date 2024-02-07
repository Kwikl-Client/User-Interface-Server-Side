import mongoose from 'mongoose';

const HeroSchema = mongoose.Schema(
    {
        titleText: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
            default: null
        },
        originalPrice: {
            type: String,
            required: true,
        },
        offerPrice: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const CharacterSchema = mongoose.Schema(
    {
        characterName: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        briefDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
            default: null
        },
    },
    {
      timestamps: true,
    }
);

const OverviewCardSchema = mongoose.Schema({
    subTitle: {
        type: String,
        required: true,
    },
    briefDescription: {
        type: String,
        required: true,
    },
})

const OverviewSchema = mongoose.Schema(
    {
        overallTitle: {
            type: String,
            required: true,
        },
        cards: [{
            type: OverviewCardSchema
        }],
        image: {
            type: String,
            required: true,
            default: null
        },
    },
    {
      timestamps: true,
    }
);

const AuthorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        briefDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false
        },
    },
    {
      timestamps: true,
    }
);
const RefundSchema = mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        subHeading: {
            type: String,
            required: true,
        },
        tagLine: {
            type: String,
            required: true,
        },
        description:{
            type:String,
            required:true,
        }
    },
    {
      timestamps: true,
    }
);
const TestimonalSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        profession: {
            type: String,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
    },
    {
      timestamps: true,
    }
);
const OfferBannerSchema = mongoose.Schema(
    {
        cutoffDate: {
            type: Date,
            required: true
        },
        price: {
            type: String,
            required: true
        }
    }
)
const FomoSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        briefDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false
        },
    },
    {
      timestamps: true,
    }
);
const UltimateSchema = mongoose.Schema(
    {
        titleText: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        frontCoverImg: {
            type: String,
            required: false,
            default: null
        },
        originalPrice: {
            type: String,
            required: true,
        },
        offerPrice: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const BookSchema = mongoose.Schema(
    {
        chapterName:{
            type: String,
            required: true,
        },
        content:{
            type: [String],
            required: true
        }
    },
    {
        timestamps: true,
    }
);
const PolicySchema = mongoose.Schema(
    {
        paragraph1:{
            type: String,
            required: true,
        },
        secondHeading:{
            type: String,
            required: true,
        },
        paragraph2:{
            type: String,
            required: true,
        },
        thirdHeading:{
            type: String,
            required: true,
        },
        paragraph3:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const UserAgreementSchema = mongoose.Schema(
    {
        paragraph1:{
            type: String,
            required: true,
        },
        secondHeading:{
            type: String,
            required: true,
        },
        paragraph2:{
            type: String,
            required: true,
        },
        thirdHeading:{
            type: String,
            required: true,
        },
        paragraph3:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const TndCSchema = mongoose.Schema(
    {
        paragraph1:{
            type: String,
            required: true,
        },
        secondHeading:{
            type: String,
            required: true,
        },
        paragraph2:{
            type: String,
            required: true,
        },
        thirdHeading:{
            type: String,
            required: true,
        },
        paragraph3:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const RichTextSchema = mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
const heroModel = mongoose.model('hero', HeroSchema, 'hero');
const characterModel = mongoose.model('character', CharacterSchema, 'character');
const overviewModel = mongoose.model('overview', OverviewSchema, 'overview');
const authorModel = mongoose.model('author', AuthorSchema, 'author');
const offerBannerModel = mongoose.model('offerBanner', OfferBannerSchema, 'offerBanner');
const fomoModel = mongoose.model('fomo', FomoSchema, 'fomo');
const ultimateModel = mongoose.model('ultimate', UltimateSchema, 'ultimate');
const bookModel = mongoose.model('book', BookSchema, 'book');
const refundModel = mongoose.model('refund', RefundSchema, 'refund');
const testimonalModel = mongoose.model('testimonal', TestimonalSchema, 'testimonal');
const policyModel = mongoose.model('policy', PolicySchema, 'policy');
const userAgreementModel=  mongoose.model('userAgreement', UserAgreementSchema, 'userAgreement');
const tndCModel=  mongoose.model('tndC', TndCSchema, 'tndC')
const richTextCModel=  mongoose.model('richText', RichTextSchema, 'richText')

export { heroModel, characterModel, overviewModel, authorModel, offerBannerModel, fomoModel, ultimateModel, bookModel,refundModel ,testimonalModel,policyModel,userAgreementModel,tndCModel,richTextCModel};
