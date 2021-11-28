import mongoose from 'mongoose';
//user schema that defines the entity
const imageSchema = new mongoose.Schema({
    // define type, required (the most important)
    file_name: {
        type: String,
        required: true,
    },
    home_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
    },
}, { timestamps: true});

export default mongoose.model('Image', imageSchema); //Export data formatting
