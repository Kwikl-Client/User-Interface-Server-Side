import { heroModel, characterModel, overviewModel, authorModel, offerBannerModel,
  fomoModel, ultimateModel, bookModel,refundModel, testimonalModel  } from "../models/contentModel.js";
import customerModel from "../models/customerModel.js";

export const editHero = async(req, res) => {
  try {
    const {titleText, shortDescription, originalPrice, offerPrice} = req.body;
    const hero = await heroModel.findOne({});
    hero.titleText = titleText || hero.titleText;
    hero.shortDescription = shortDescription || hero.shortDescription;
    hero.originalPrice = originalPrice || hero.originalPrice;
    hero.offerPrice = offerPrice || hero.offerPrice;
    hero.image = req.picUrls?.image || hero.image;
    await hero.save();
    return res.json({
      success: true,
      message: 'Hero data edited successfully',
      data: hero
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const editCharacters = async(req, res) => {
  try {
    const {_id} = req.params;
    const {characterName, shortDescription, briefDescription}=req.body
    const character = await characterModel.findById(_id);
    character.characterName = characterName || character.characterName;
    character.shortDescription = shortDescription || character.shortDescription;
    character.briefDescription = briefDescription || character.briefDescription;
    character.image = req.picUrls?.image || character.image;
    await character.save();
    return res.json({
      success: true,
      message: 'Character data edited successfully',
      data: character
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const editOverview = async(req, res) => {
  try {
    const {overallTitle, cards} = req.body;
    const overview = await overviewModel.findOne({});
    overview.overallTitle = overallTitle || overview.overallTitle;
    overview.cards = JSON.parse(cards) || overview.cards;
    overview.image = req.picUrls?.image || overview.image;
    await overview.save();
    return res.json({
      success: true,
      message: 'Overview data edited successfully',
      data: overview
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const editAuthor = async(req, res) => {
  try {
    const {name, shortDescription, briefDescription} = req.body;
    const author = await authorModel.findOne({});
    author.name = name || author.name;
    author.shortDescription = shortDescription || author.shortDescription;
    author.briefDescription = briefDescription || author.briefDescription;
    author.image = req.picUrls?.image || author.image;
    await author.save();
    return res.json({
      success: true,
      message: 'Author data edited successfully',
      data: author
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editFomoAuthor = async(req, res) => {
  try {
    const {name, shortDescription, briefDescription} = req.body;
    const author = await fomoModel.findOne({});
    author.name = name || author.name;
    author.shortDescription = shortDescription || author.shortDescription;
    author.briefDescription = briefDescription || author.briefDescription;
    author.image = req.picUrls?.image || author.image;
    await author.save();
    return res.json({
      success: true,
      message: 'Author data edited successfully',
      data: author
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editRefund = async (req, res) => {
  try {
    const { heading, subHeading, tagLine, description } = req.body;
    let refund = await refundModel.findOne({});
    
    if (!refund) {
      // If no document exists, create a new one
      refund = new refundModel();
    }

    refund.heading = heading || refund.heading;
    refund.subHeading = subHeading || refund.subHeading;
    refund.tagLine = tagLine || refund.tagLine;
    refund.description = description || refund.description;

    await refund.save();

    return res.json({
      success: true,
      message: 'Refund data edited successfully',
      data: refund
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const editReviews = async(req, res) => {
  try {
    const {name, profession,feedback} = req.body;
    const reviews = await testimonalModel.findOne({});
    reviews.name = name || reviews.name;
    reviews.profession = profession || reviews.profession;
    reviews.feedback = feedback || reviews.feedback
    await reviews.save();
    return res.json({
      success: true,
      message: 'reviews data edited successfully',
      data: reviews
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editUltimate = async (req, res) => {
  try {
    const { titleText, shortDescription, originalPrice, offerPrice } = req.body;
    let hero = await ultimateModel.findOne({});
    if (!hero) {
      hero = new ultimateModel({
        titleText,
        shortDescription,
        originalPrice,
        offerPrice,
      });
    } else {
      hero.titleText = titleText || hero.titleText;
      hero.shortDescription = shortDescription || hero.shortDescription;
      hero.originalPrice = originalPrice || hero.originalPrice;
      hero.offerPrice = offerPrice || hero.offerPrice;
    }

    // Save the updated hero document
    await hero.save();

    return res.json({
      success: true,
      message: 'Ultimate data edited successfully',
      data: hero,
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const editOffer = async(req, res) => {
  try {
    const {cutoffDate, price} = req.body;
    const offer = await offerBannerModel.findOne({});
    offer.cutoffDate = cutoffDate || offer.cutoffDate;
    offer.price = price || offer.price;
    await offer.save();
    return res.json({
      success: true,
      message: 'Offer data edited successfully',
      data: offer
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};


export const getHero = async(req, res) => {
  try {
    const heroData = await heroModel.findOne({});
    return res.json({
      success: true,
      message: 'Hero data fetched successfully',
      data: heroData
    });
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getCharacters = async(req, res) => {
  try {
    const charactersData = await characterModel.find({});
    return res.json({
      success: true,
      message: 'characters data fetched successfully',
      data: charactersData
    });
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getOverview = async (req, res) => {
  try {
    const overviewData = await overviewModel.findOne({});
    return res.json({
      success: true,
      message: 'Overview data fetched successfully',
      data: overviewData
    });
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getAuthor = async(req, res) => {
  try {
    const authorData = await authorModel.findOne({});
    return res.json({
      success: true,
      message: 'Author data received successfully',
      data: authorData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const getRefund = async(req, res) => {
  try {
    const refundData = await refundModel.findOne({});
    return res.json({
      success: true,
      message: 'refund data received successfully',
      data: refundData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};
export const getReviews = async (req, res) => {
  try {
    const allCustomersData = await customerModel.find({});
    const reviews = allCustomersData.flatMap((customerData) =>
      customerData.reviews.map((review, index) => ({
        id: index + 1,
        customerId: customerData._id,
        name: customerData.name || null, // Assuming there is a 'name' property in each customer
        starRating: review.starRating || null,
        profession: review.profession || null,
        reviewText: review.reviewText || null,
      }))
    );

    return res.json({
      success: true,
      message: 'Review data received successfully',
      data: reviews
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



export const getOffer = async(req, res) => {
  try {
    const offerBannerData = await offerBannerModel.findOne({});
    return res.json({
      success: true,
      message: 'Offer Banner data fetched successfully',
      data: offerBannerData
    });
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const getUltimateHero = async(req, res) => {
  try {
    const heroData = await ultimateModel.findOne({});
    return res.json({
      success: true,
      message: 'Hero data fetched successfully',
      data: heroData
    });
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getFomoAuthor = async(req, res) => {
  try {
    const fomoauthorData = await fomoModel.findOne({});
    return res.json({
      success: true,
      message: 'Author data received successfully',
      data: fomoauthorData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};

export const getBook = async(req, res) => {
  try {
    const book = await bookModel.find();
    let requiredFormat = {};
    for(const item of book)
      requiredFormat[item.chapterName]=item.content
    return res.json({
      success: true,
      message: 'Book fetched successfully',
      data: requiredFormat
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error});
  }
}

export const getFreeBook = async (req, res) => {
  try {
    const book = await bookModel.find();
    let requiredFormat = {};

    for (let i = 0; i < book.length; i++) {
      const item = book[i];
      let temp = [...item.content];  // Clone the content to avoid modifying the original array.

      // For index[0], display the entire content.
      if (i === 0) {
        requiredFormat[item.chapterName] = temp;
      }
      // For index[1], only show the first 4 pages.
      else if (i === 1) {
        temp.splice(4);  // Keep the first 4 pages and remove the rest.
        requiredFormat[item.chapterName] = temp;
      }
      // For other chapters, keep the first 3 pages and append a message.
      else {
        temp.splice(3);  // Keep the first 3 pages for other chapters.
        requiredFormat[item.chapterName] = temp;
      }
    }

    return res.json({
      success: true,
      message: 'Book fetched successfully',
      data: requiredFormat,
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};


export const insertChapter = async(req, res) => {
  try {
    await bookModel.insertMany(req.body);
    const projection = { _id: 1, chapterName: 1 };
    const chapters = await bookModel.find({}, projection);
    return res.json({
      success: true,
      message: 'New chapter uploaded successfully',
      data: chapters
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error});
  }
}

export const getChapters = async(req, res) => {
  try {
    const projection = { _id: 1, chapterName: 1 };
    const chapters = await bookModel.find({}, projection);
    return res.json({
      success: true,
      message: 'Chapters listed successfully',
      data: chapters
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error});
  }
}

export const deleteChapter =async(req, res)=>{
  try {
    const {id} = req.params;
    await bookModel.deleteOne({ _id: id });
    const projection = { _id: 1, chapterName: 1 };
    const chapters = await bookModel.find({}, projection);
    return res.json({
      success: true,
      message: 'Chapter deleted successfully',
      data: chapters
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error});
  }
}
