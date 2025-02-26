import {bookModel} from "../models/contentModel.js";

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
