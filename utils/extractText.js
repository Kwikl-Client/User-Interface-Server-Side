import { Document, Packer } from 'docx';
import { parseDocx } from 'docx-parser'; // Ensure you have a suitable parser or library
import mammoth from 'mammoth';

export const processExtractedText = (htmlText) => {
  // Convert HTML to plain text with paragraph breaks
  // You may need to use an HTML parser to handle this properly
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const paragraphs = doc.querySelectorAll('p');

  // Join paragraphs with extra spacing
  return Array.from(paragraphs).map(p => p.textContent).join('\n\n');
};
export const extractSceneFromDocument = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`Error extracting text: ${error.message}`);
  }
};
export const extractEpilogueFromDocument = async (buffer) => {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value; 
    } catch (error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
  };
  export const extractWOTSFromDocument = async (buffer) => {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value; 
    } catch (error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
  };
    
  
  
  
  
  
  
  
  