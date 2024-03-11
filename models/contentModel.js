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
        button1: {  
            type: String,
            required: true,
        },
        button2: {  
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
        // heading: {
        //     type: String,
        //     required: true,
        // },
        // subHeading: {
        //     type: String,
        //     required: true,
        // },
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
        briefDescription2: {
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
// const CharactersCardsSchema = mongoose.Schema(
//     {
       
//         characterName: {
//             type: String,
//             required: true,
//         },
//         shortDescription: {
//             type: String,
//             required: true,
//         },
//         briefDescription: {
//             type: String,
//             required: true,
//         },
//         image: {
//             type: String,
//             required: true,
//             default: null
//         },
//     }
// );
// const CharacterSchema = mongoose.Schema(
//     {
//         heading: {
//             type: String,
//             required: true,
//         },
//         subHeading: {
//             type: String,
//             required: true,
//         },
//         characters: [{
//             type: CharactersCardsSchema
//         }]    
//     },
//     {
//       timestamps: true,
//     }
// );

// const OverviewCardSchema = mongoose.Schema({
//     subTitle: {
//         type: String,
//         required: true,
//     },
//     briefDescription: {
//         type: String,
//         required: true,
//     },
// })

const OverviewSchema = mongoose.Schema(
    {
        Title: {
            type: String,
            required: true,
        },
        subHeading:{
         type:String,
         required: true,
        },
        overallTitle: {
            type: String,
            required: true,
        },
        subtitle1: {
            type: String,
            required: true,
        },
        briefDescription1: {
            type: String,
            required: true,
        },
        subtitle2: {
            type: String,
            required: true,
        },
        briefDescription2: {
            type: String,
            required: true,
        },
        subtitle3: {
            type: String,
            required: true,
        },
        briefDescription3: {
            type: String,
            required: true,
        }
    },
    {
      timestamps: true,
    }
);

const AuthorSchema = mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
        },
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
const FooterSchema = mongoose.Schema(
    {
        image1Content: {
            type: String,
            required: true,
        },
        image2Content: {
            type: String,
            required: true,
        },
        image3Content: {
            type: String,
            required: true,
        },
        image4Content: {
            type: String,
            required: true,
        },
        copyrights: {
            type: String,
            required: false
        },
        privacyPolicy: {
            type: String,
            required: false
        },
        userAgreement: {
            type: String,
            required: false
        },
        tAndc: {
            type: String,
            required: false
        },
        faqs: {
            type: String,
            required: false
        },
    },
    {
      timestamps: true,
    }
);
const HeaderSchema = mongoose.Schema(
    {
        menu1: {
            type: String,
            required: true,
        },
        menu2: {
            type: String,
            required: true,
        },
        menu3: {
            type: String,
            required: true,
        },
        menu4: {
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
        heading: {
            type: String,
            required: true,
        },
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
const TalkToAuthorSchema = mongoose.Schema(
    {
        content:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const BecomeAStarSchema = mongoose.Schema(
    {
        label1:{
            type: String,
            required: true,
        },
        userType:{
            type: String,
            required: true,
        },
        subscription:{
            type: String,
            required: true,
        },
        italicTagline:{
            type: String,
            required: true,
        },
        quote:{
            type: String,
            required: true,
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
        },
        fourthHeading:{
            type: String,
            required: true,
        },
        paragraph4:{
            type: String,
            required: true,
        },
        fivthHeading:{
            type: String,
            required: true,
        },
        paragraph5:{
            type: String,
            required: true,
        },
        sixthHeading:{
            type: String,
            required: true,
        },
        paragraph6:{
            type: String,
            required: true,
        },
        secondList:{
            type: String,
            required: true,
        },
        firstList:{
            type: String,
            required: true,
        },
        thirdList:{
            type: String,
            required: true,
        },
        fivthList:{
            type: String,
            required: true,
        },
        sixthList:{
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
        },
        fourthHeading:{
            type: String,
            required: true,
        },
        paragraph4:{
            type: String,
            required: true,
        },
        fivthHeading:{
            type: String,
            required: true,
        },
        paragraph5:{
            type: String,
            required: true,
        },
        sixthHeading:{
            type: String,
            required: true,
        },
        paragraph6:{
            type: String,
            required: true,
        },
        secondList:{
            type: String,
            required: true,
        },
        firstList:{
            type: String,
            required: true,
        },
        thirdList:{
            type: String,
            required: true,
        },
        fivthList:{
            type: String,
            required: true,
        },
        sixthList:{
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
        },fourthHeading:{
            type: String,
            required: true,
        },
        paragraph4:{
            type: String,
            required: true,
        },
        fivthHeading:{
            type: String,
            required: true,
        },
        paragraph5:{
            type: String,
            required: true,
        },
        sixthHeading:{
            type: String,
            required: true,
        },
        paragraph6:{
            type: String,
            required: true,
        },
        secondList:{
            type: String,
            required: true,
        },
        firstList:{
            type: String,
            required: true,
        },
        thirdList:{
            type: String,
            required: true,
        },
        fivthList:{
            type: String,
            required: true,
        },
        sixthList:{
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
const headerModel = mongoose.model('header', HeaderSchema, 'header');
const footerModel = mongoose.model('footer', FooterSchema, 'footer');
const offerBannerModel = mongoose.model('offerBanner', OfferBannerSchema, 'offerBanner');
const fomoModel = mongoose.model('fomo', FomoSchema, 'fomo');
const ultimateModel = mongoose.model('ultimate', UltimateSchema, 'ultimate');
const bookModel = mongoose.model('book', BookSchema, 'book');
const refundModel = mongoose.model('refund', RefundSchema, 'refund');
const testimonalModel = mongoose.model('testimonal', TestimonalSchema, 'testimonal');
const talkToAuthorModel = mongoose.model('talktoAuthor', TalkToAuthorSchema, 'talktoAuthor');
const becomeAStarModel = mongoose.model('becomeAStar', BecomeAStarSchema, 'becomeAStar');
const policyModel = mongoose.model('policy', PolicySchema, 'policy');
const userAgreementModel=  mongoose.model('userAgreement', UserAgreementSchema, 'userAgreement');
const tndCModel=  mongoose.model('tndC', TndCSchema, 'tndC')
const richTextCModel=  mongoose.model('richText', RichTextSchema, 'richText')

export { heroModel, characterModel,footerModel, overviewModel,talkToAuthorModel,becomeAStarModel, authorModel,headerModel, offerBannerModel, fomoModel, ultimateModel, bookModel,refundModel ,testimonalModel,policyModel,userAgreementModel,tndCModel,richTextCModel};
