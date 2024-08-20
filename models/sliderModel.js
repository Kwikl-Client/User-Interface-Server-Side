import mongoose from 'mongoose';

const { Schema } = mongoose;

const paragraphSchema = new Schema({
  text: { type: String, required: true }
});

const levelSchema = new Schema({
  summary: { type: String, required: true },
  paragraphs: [paragraphSchema]
});

const mainSliderSchema = new Schema({
  summary: { type: String, required: true },
  paragraphs: [paragraphSchema],
  level1: levelSchema,
  level2: levelSchema,
  level3: levelSchema,
  level4: levelSchema
});

const SliderContentSchema = new Schema({
  mainSlider: mainSliderSchema
});

const SliderContent = mongoose.model('SliderContent', SliderContentSchema);

export default SliderContent;
