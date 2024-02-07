import { heroModel, characterModel, overviewModel, authorModel, offerBannerModel,
  fomoModel, ultimateModel, bookModel,refundModel, testimonalModel,policyModel, userAgreementModel, tndCModel,richTextCModel  } from "../models/contentModel.js";
import mammoth from "mammoth";
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
export const editPolicy = async (req, res) => {
  try {
    const { paragraph1, paragraph2, paragraph3,secondHeading,thirdHeading} = req.body;
    let policy = await policyModel.findOne({});
    
    if (!policy) {
      // If no document exists, create a new one
      policy = new policyModel();
    }

    policy.paragraph1 = paragraph1 || policy.paragraph1;
    policy.secondHeading = secondHeading || policy.secondHeading;
    policy.paragraph2 = paragraph2 || policy.paragraph2;
    policy.thirdHeading = thirdHeading || policy.thirdHeading;
    policy.paragraph3 = paragraph3 || policy.paragraph3;

    await policy.save();

    return res.json({
      success: true,
      message: 'policy data edited successfully',
      data: policy
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
export const editUserAgreement = async (req, res) => {
  try {
    const { paragraph1, paragraph2, paragraph3,secondHeading,thirdHeading} = req.body;
    let userAgreement = await userAgreementModel.findOne({});
    
    if (!userAgreement) {
      // If no document exists, create a new one
      userAgreement = new userAgreementModel();
    }

    userAgreement.paragraph1 = paragraph1 || userAgreement.paragraph1;
    userAgreement.secondHeading = secondHeading || userAgreement.secondHeading;
    userAgreement.paragraph2 = paragraph2 || userAgreement.paragraph2;
    userAgreement.thirdHeading = thirdHeading || userAgreement.thirdHeading;
    userAgreement.paragraph3 = paragraph3 || userAgreement.paragraph3;

    await userAgreement.save();

    return res.json({
      success: true,
      message: 'userAgreement data edited successfully',
      data: userAgreement
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
export const editTndC = async (req, res) => {
  try {
    const { paragraph1, paragraph2, paragraph3,secondHeading,thirdHeading} = req.body;
    let tndC = await tndCModel.findOne({});
    
    if (!tndC) {
      // If no document exists, create a new one
      tndC = new tndCModel();
    }

    tndC.paragraph1 = paragraph1 || tndC.paragraph1;
    tndC.secondHeading = secondHeading || tndC.secondHeading;
    tndC.paragraph2 = paragraph2 || tndC.paragraph2;
    tndC.thirdHeading = thirdHeading || tndC.thirdHeading;
    tndC.paragraph3 = paragraph3 || tndC.paragraph3;

    await tndC.save();

    return res.json({
      success: true,
      message: 'userAgreement data edited successfully',
      data: tndC
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
    const { titleText, shortDescription, originalPrice, offerPrice,image } = req.body;
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
      hero.image = req.picUrls?.image || hero.image;

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

export const getPolicy = async(req, res) => {
  try {
    const policyData = await policyModel.findOne({});
    return res.json({
      success: true,
      message: 'policy data received successfully',
      data: policyData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};
export const getUserAgreement = async(req, res) => {
  try {
    const agreementData = await userAgreementModel.findOne({});
    return res.json({
      success: true,
      message: 'policy data received successfully',
      data: agreementData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
  }
};
export const getTndC = async(req, res) => {
  try {
    const tndCData = await tndCModel.findOne({});
    return res.json({
      success: true,
      message: 'policy data received successfully',
      data: tndCData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
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
    console.log("abc");
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
//   try {
//     const books = await bookModel.find(); // Retrieve books from the database

//     let formattedBooks = {};
//     for (const book of books) {
//       if (book && book.content && book.content.buffer) {
//         const { value } = await mammoth.extractRawText({ arrayBuffer: Buffer.from(book.content.buffer) });
        
//         const htmlContent = `<div>${value}</div>`; // Wrapping in <div> for better structure

//         formattedBooks[book.chapterName] = htmlContent;
//       } else {
//         console.error(`Skipping book with missing or invalid content: ${JSON.stringify(book)}`);
//       }
//     }

//     return res.json({
//       success: true,
//       message: 'Books fetched successfully',
//       data: formattedBooks,
//     });
//   } catch (error) {
//     console.error('Error fetching books:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error,
//     });
//   }
// };
  try {
    const book = await bookModel.find();
    let requiredFormat = {};
    for(const item of book){
      const temp = [...item.content]
      console.log(item.content)
      temp.splice(2);
      temp.push("Please Purchase the book to view all the pages");
      requiredFormat[item.chapterName] = temp
      console.log(requiredFormat)
    }
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
 export const richText = async(req, res)=>{
  try {
    const { content } = req.body;

    const newRichText = new richTextCModel({ content });
    await newRichText.save();

    return res.json({
      success: true,
      message: 'Content saved successfully',
      data: newRichText,
    });
  } catch (error) {
    console.error('Error saving content:', error);s
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
 
export const insertChapter = async (req, res) => {
  try {
    await bookModel.insertMany(req.body, { preserveWhiteSpace: true });
    const projection = { _id: 1, chapterName: 1 };
    const chapters = await bookModel.find({}, projection);
    return res.json({
      success: true,
      message: 'New chapter uploaded successfully',
      data: chapters
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
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