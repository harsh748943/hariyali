const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latinName: { type: String, required: true },
  category: { type: String, enum: ['Indoor', 'Outdoor', 'Seeds'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  careInstructions: {
    light: String,
    water: String,
    soil: String,
  },
  image: { type: String, required: true },
  isSeasonal: { type: Boolean, default: false },
  stock: { type: Number, required: true, min: 0 },
});

// Transform the output to match the frontend's expectations (id instead of _id)
PlantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Plant', PlantSchema);