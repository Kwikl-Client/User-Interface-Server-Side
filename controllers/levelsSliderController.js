import SliderContent from '../models/sliderModel.js'; // Adjust the import according to your project structure

export const editSliderContent = async (req, res) => {
    try {
      const {
        mainSliderSummary,
        mainSliderParagraphs,
        level1Summary,
        level1Paragraphs,
        level2Summary,
        level2Paragraphs,
        level3Summary,
        level3Paragraphs,
        level4Summary,
        level4Paragraphs
      } = req.body;
  
      let sliderContent = await SliderContent.findOne({}); // Find the single document
  
      if (!sliderContent) {
        // If no document exists, create a new one
        sliderContent = new SliderContent();
      }
  
      // Update mainSlider summary and paragraphs
      sliderContent.mainSlider.summary = mainSliderSummary || sliderContent.mainSlider.summary;
      sliderContent.mainSlider.paragraphs = mainSliderParagraphs?.map(paragraph => ({ text: paragraph })) || sliderContent.mainSlider.paragraphs;
  
      // Update level1 summary and paragraphs
      sliderContent.mainSlider.level1.summary = level1Summary || sliderContent.mainSlider.level1.summary;
      sliderContent.mainSlider.level1.paragraphs = level1Paragraphs?.map(paragraph => ({ text: paragraph })) || sliderContent.mainSlider.level1.paragraphs;
  
      // Update level2 summary and paragraphs
      sliderContent.mainSlider.level2.summary = level2Summary || sliderContent.mainSlider.level2.summary;
      sliderContent.mainSlider.level2.paragraphs = level2Paragraphs?.map(paragraph => ({ text: paragraph })) || sliderContent.mainSlider.level2.paragraphs;
  
      // Update level3 summary and paragraphs
      sliderContent.mainSlider.level3.summary = level3Summary || sliderContent.mainSlider.level3.summary;
      sliderContent.mainSlider.level3.paragraphs = level3Paragraphs?.map(paragraph => ({ text: paragraph })) || sliderContent.mainSlider.level3.paragraphs;
  
      // Update level4 summary and paragraphs
      sliderContent.mainSlider.level4.summary = level4Summary || sliderContent.mainSlider.level4.summary;
      sliderContent.mainSlider.level4.paragraphs = level4Paragraphs?.map(paragraph => ({ text: paragraph })) || sliderContent.mainSlider.level4.paragraphs;
  
      await sliderContent.save();
  
      return res.json({
        success: true,
        message: 'Slider content edited successfully',
        data: sliderContent
      });
    } catch (error) {
      console.error('Error editing slider content:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  };
export const getSliderContent = async (req, res) => {
        try {
          const sliderContentData = await SliderContent.find({});
          return res.json({
            success: true,
            message: 'Slider content data fetched successfully',
            data: sliderContentData
          });
        } catch (error) {
          console.error('Error fetching slider content:', error);
          return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
          });
        }
      };      