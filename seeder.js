import dotenv from 'dotenv';
import colors from 'colors';
import { heroModel, characterModel, overviewModel, authorModel, offerBannerModel, bookModel } from "./models/contentModel.js";
import hero from './data/hero.js';
import characters from './data/characters.js';
import overview from './data/overview.js';
import author from './data/author.js';
import offerBanner from './data/offerbanner.js';
import book from './data/book.js';
import connectDB from './utils/connectDb.js';

colors.enable();
dotenv.config();

await connectDB();

const importData = async () => {
  try {
    // await heroModel.insertMany(hero);
    // await characterModel.insertMany(characters);
    // await overviewModel.insertMany(overview);
    // await authorModel.insertMany(author);
    // await offerBannerModel.insertMany(offerBanner);
    await bookModel.insertMany(book);
    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await heroModel.deleteMany();
    await characterModel.deleteMany();
    await overviewModel.deleteMany();
    await authorModel.deleteMany();
    await offerBannerModel.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === 'clean') {
  destroyData();
}
else if (process.argv[2] === 'import'){
  importData();
}
else{
    console.log("Put valid argument, either clean or import".bold.yellow);
    process.exit();
}
