import {
  heroModel, characterModel, overviewModel, authorModel, offerBannerModel,
  fomoModel, ultimateModel, bookModel, refundModel, testimonalModel, policyModel, userAgreementModel, tndCModel, richTextCModel, headerModel, talkToAuthorModel, becomeAStarModel, footerModel
} from "../models/contentModel.js";
import mammoth from "mammoth";
import customerModel from "../models/customerModel.js";

export const editHero = async (req, res) => {
  try {
    const { titleText, shortDescription, originalPrice, offerPrice,button1,button2 } = req.body;
    const hero = await heroModel.findOne({});
    hero.titleText = titleText || hero.titleText;
    hero.shortDescription = shortDescription || hero.shortDescription;
    hero.originalPrice = originalPrice || hero.originalPrice;
    hero.offerPrice = offerPrice || hero.offerPrice;
    hero.button1 = button1 || hero.button1;
    hero.button2 = button2 || hero.button2;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const editCharacters = async (req, res) => {
  try {
    const { _id } = req.params;
    const { characterName, shortDescription, briefDescription,briefDescription2,briefDescription3,briefDescription4 } = req.body
    const character = await characterModel.findById(_id);
    // character.heading = heading || character.heading;
    // character.subHeading = subHeading || character.subHeading;
    character.characterName = characterName || character.characterName;
    character.shortDescription = shortDescription || character.shortDescription;
    character.briefDescription = briefDescription || character.briefDescription;
    character.briefDescription2 = briefDescription2 || character.briefDescription2;
    character.briefDescription3 = briefDescription3 || character.briefDescription3;
    character.briefDescription4 = briefDescription4 || character.briefDescription4;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const editOverview = async (req, res) => {
  try {
    const { title,subHeading, overallTitle, cards,button } = req.body;
    const overview = await overviewModel.findOne({});
    overview.title = title || overview.title;
    overview.subHeading = subHeading || overview.subHeading;
    overview.overallTitle = overallTitle || overview.overallTitle;
    overview.button = button || overview.button;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editFooter = async (req, res) => {
  try {
    const { image1Content,image2Content, image3Content, image4Content,copyrights,privacyPolicy,userAgreement,tAndc,faqs } = req.body;
    let footerData = await footerModel.findOne({});
    if (!footerData) {
      // If no footer data found, create a new document
      footerData = new footerModel();
    }
    footerData.image1Content = image1Content || footerData.image1Content;
    footerData.image2Content = image2Content || footerData.image2Content;
    footerData.image3Content = image3Content || footerData.image3Content;
    footerData.image4Content = image4Content || footerData.image4Content;
    footerData.copyrights = copyrights || footerData.copyrights;
    footerData.privacyPolicy = privacyPolicy || footerData.privacyPolicy;
    footerData.userAgreement = userAgreement || footerData.userAgreement;
    footerData.tAndc = tAndc || footerData.tAndc;
    footerData.faqs = faqs || footerData.faqs;
    await footerData.save();
    return res.json({
      success: true,
      message: 'footer data edited successfully',
      data: footerData
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editHeader = async (req, res) => {
  try {
    const { menu1: newMenu1, menu2: newMenu2, menu3: newMenu3, menu4: newMenu4 } = req.body;
    // console.log(req.body);
    let header = await headerModel.findOne({});

    // Check if header is null
    if (!header) {
      header = new headerModel(); // Create a new header if it doesn't exist
    }

    header.menu1 = newMenu1 || header.menu1;
    header.menu2 = newMenu2 || header.menu2;
    header.menu3 = newMenu3 || header.menu3;
    header.menu4 = newMenu4 || header.menu4;
    header.image = req.picUrls?.image || header.image;
    await header.save();
    return res.json({
      success: true,
      message: 'header data edited successfully',
      data: header
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

export const editAuthor = async (req, res) => {
  try {
    const { heading, name, shortDescription, briefDescription,button } = req.body;
    const author = await authorModel.findOne({});
    author.heading = heading || author.heading;
    author.name = name || author.name;
    author.shortDescription = shortDescription || author.shortDescription;
    author.briefDescription = briefDescription || author.briefDescription;
    author.button = button || author.button;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editFomoAuthor = async (req, res) => {
  try {
    const { heading, name, shortDescription, briefDescription,button } = req.body;
    const author = await fomoModel.findOne({});
    author.heading = heading || author.heading;
    author.name = name || author.name;
    author.shortDescription = shortDescription || author.shortDescription;
    author.briefDescription = briefDescription || author.briefDescription;
    author.button = button || author.button;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editRefund = async (req, res) => {
  try {
    const { heading, subHeading, tagLine, description, button } = req.body;
    let refund = await refundModel.findOne({});

    if (!refund) {
      // If no document exists, create a new one
      refund = new refundModel();
    }

    refund.heading = heading || refund.heading;
    refund.subHeading = subHeading || refund.subHeading;
    refund.tagLine = tagLine || refund.tagLine;
    refund.description = description || refund.description;
    refund.button = button || refund.button;

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
    const { paragraph1, paragraph2, paragraph3, secondHeading, thirdHeading, paragraph4, paragraph5, paragraph6, fourthHeading,
      secondList ,firstList,thirdList,fivthList,sixthList, fivthHeading, sixthHeading  } = req.body;
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
    policy.paragraph4 = paragraph4 || policy.paragraph4;
    policy.paragraph6 = paragraph6 || policy.paragraph6;
    policy.fourthHeading = fourthHeading || policy.fourthHeading;
    policy.paragraph5 = paragraph5 || policy.paragraph5;
    policy.fivthHeading = fivthHeading || policy.fivthHeading;
    policy.sixthHeading = sixthHeading || policy.sixthHeading;
    policy.secondList = secondList || policy.secondList;
    policy.firstList = firstList || policy.firstList;
    policy.thirdList = thirdList || policy.thirdList;
    policy.fivthList = fivthList || policy.fivthList;
    policy.sixthList = sixthList || policy.sixthList;


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
export const editTalkToAuthor = async (req, res) => {
  try {
    const { content } = req.body;
    let talk2Author = await talkToAuthorModel.findOne({});
    if (!talk2Author) {
      talk2Author = new talkToAuthorModel();
    }

    talk2Author.content = content || talk2Author.content;

    await talk2Author.save();

    return res.json({
      success: true,
      message: 'talk2Author data edited successfully',
      data: talk2Author
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
export const editBecomeAStar = async (req, res) => {
  try {
    const { label1, userType,subscription,italicTagline,quote } = req.body;
    let becomeAStar = await becomeAStarModel.findOne({});
    if (!becomeAStar) {
      becomeAStar = new becomeAStarModel();
    }
    becomeAStar.label1 = label1 || becomeAStar.label1;
    becomeAStar.userType = userType || becomeAStar.userType;
    becomeAStar.subscription = subscription || becomeAStar.subscription;
    becomeAStar.italicTagline = italicTagline || becomeAStar.italicTagline;
    becomeAStar.quote = quote || becomeAStar.quote;

    await becomeAStar.save();
    return res.json({
      success: true,
      message: 'becomeAStar data edited successfully',
      data: becomeAStar
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
    const { paragraph1, paragraph2, paragraph3, secondHeading, thirdHeading, paragraph4, paragraph5, paragraph6, fourthHeading,
      secondList ,firstList,thirdList,fivthList,sixthList, fivthHeading, sixthHeading   } = req.body;
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
    userAgreement.paragraph4 = paragraph4 || userAgreement.paragraph4;
    userAgreement.paragraph6 = paragraph6 || userAgreement.paragraph6;
    userAgreement.fourthHeading = fourthHeading || userAgreement.fourthHeading;
    userAgreement.paragraph5 = paragraph5 || userAgreement.paragraph5;
    userAgreement.fivthHeading = fivthHeading || userAgreement.fivthHeading;
    userAgreement.sixthHeading = sixthHeading || userAgreement.sixthHeading;
    userAgreement.secondList = secondList || userAgreement.secondList;
    userAgreement.firstList = firstList || userAgreement.firstList;
    userAgreement.thirdList = thirdList || userAgreement.thirdList;
    userAgreement.fivthList = fivthList || userAgreement.fivthList;
    userAgreement.sixthList = sixthList || userAgreement.sixthList;

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
    const { paragraph1, paragraph2, paragraph3, secondHeading, thirdHeading , paragraph4, paragraph5, paragraph6, fourthHeading,
      secondList ,firstList,thirdList,fivthList,sixthList, fivthHeading, sixthHeading   } = req.body;
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
    tndC.paragraph4 = paragraph4 || tndC.paragraph4;
    tndC.paragraph6 = paragraph6 || tndC.paragraph6;
    tndC.fourthHeading = fourthHeading || tndC.fourthHeading;
    tndC.paragraph5 = paragraph5 || tndC.paragraph5;
    tndC.fivthHeading = fivthHeading || tndC.fivthHeading;
    tndC.sixthHeading = sixthHeading || tndC.sixthHeading;
    tndC.secondList = secondList || tndC.secondList;
    tndC.firstList = firstList || tndC.firstList;
    tndC.thirdList = thirdList || tndC.thirdList;
    tndC.fivthList = fivthList || tndC.fivthList;
    tndC.sixthList = sixthList || tndC.sixthList;

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
export const editReviews = async (req, res) => {
  try {
    const { name, profession, feedback } = req.body;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const editUltimate = async (req, res) => {
  try {
    const { titleText, shortDescription, originalPrice, offerPrice, image, button } = req.body;
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
      hero.button = button || hero.button;
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

export const editOffer = async (req, res) => {
  try {
    const { cutoffDate, price } = req.body;
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};


export const getHero = async (req, res) => {
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getCharacters = async (req, res) => {
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const getFooter = async (req, res) => {
  try {
    const footerData = await footerModel.findOne({});
    return res.json({
      success: true,
      message: 'footer data fetched successfully',
      data: footerData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const getAuthor = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getHeader = async (req, res) => {
  try {
    const headerData = await headerModel.findOne({});
    return res.json({
      success: true,
      message: 'Author data received successfully',
      data: headerData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getRefund = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
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

export const getPolicy = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getTalkToAuthor = async (req, res) => {
  try {
    const talk2Author = await talkToAuthorModel.findOne({});
    return res.json({
      success: true,
      message: 'talk2Author data received successfully',
      data: talk2Author
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getBecomeAStar = async (req, res) => {
  try {
    const becomeAStar = await becomeAStarModel.findOne({});
    return res.json({
      success: true,
      message: 'becomeAStar data received successfully',
      data: becomeAStar
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getUserAgreement = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getTndC = async (req, res) => {
  try {
    const tndCData = await tndCModel.findOne({});
    return res.json({
      success: true,
      message: 'tndCData data received successfully',
      data: tndCData
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const getOffer = async (req, res) => {
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};
export const getUltimateHero = async (req, res) => {
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
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message,
    });
  }
};

export const getFomoAuthor = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await bookModel.find();
    let requiredFormat = {};
    for (const item of book)
      requiredFormat[item.chapterName] = item.content
    return res.json({
      success: true,
      message: 'Book fetched successfully',
      data: requiredFormat
    });
  }
  catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
}

export const getFreeBook = async (req, res) => {
  try {
    const book = await bookModel.find();
    let requiredFormat = {};
    for (const item of book) {
      const temp = [...item.content];
      temp.splice(6);
      temp.push("Discover the Self-Transcendence of Sals! Purchase Access to Read More");
      requiredFormat[item.chapterName] = temp;
      // console.log(requiredFormat);
    }
    return res.json({
      success: true,
      message: 'Book fetched successfully',
      data: requiredFormat
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
};

export const richText = async (req, res) => {
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
    console.error('Error saving content:', error); s
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

export const getChapters = async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
}

export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
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
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
}