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
        frontCoverImg: {
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

const heroModel = mongoose.model('hero', HeroSchema, 'hero');
const characterModel = mongoose.model('character', CharacterSchema, 'character');
const overviewModel = mongoose.model('overview', OverviewSchema, 'overview');
const authorModel = mongoose.model('author', AuthorSchema, 'author');
const offerBannerModel = mongoose.model('offerBanner', OfferBannerSchema, 'offerBanner');

export { heroModel, characterModel, overviewModel, authorModel, offerBannerModel };
