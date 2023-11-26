import { heroModel, characterModel, overviewModel, authorModel, offerBannerModel } from "../models/contentModel.js";

export const editHero = async(req, res) => {
  try {
    const {titleText, shortDescription, originalPrice, offerPrice} = req.body;
    const hero = await heroModel.findOne({});
    hero.titleText = titleText || hero.titleText;
    hero.shortDescription = shortDescription || hero.shortDescription;
    hero.originalPrice = originalPrice || hero.originalPrice;
    hero.offerPrice = offerPrice || hero.offerPrice;
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
    const {characterName, shortDescription, briefDescription}=req.body
    return res.json({
      success: true,
      message: 'Form data received successfully',
      data: newHero
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
    overview.cards = cards || overview.cards;
    await overview.save();
    return res.json({
      success: true,
      message: 'Form data received successfully',
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
    await author.save();
    return res.json({
      success: true,
      message: 'Form data received successfully',
      data: author
    });
  }
  catch (error) {
      console.error('Error processing form data:', error);
      return res.status(500).json({success: false, message: 'Internal server error', error: error.message,
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
      message: 'Form data received successfully',
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