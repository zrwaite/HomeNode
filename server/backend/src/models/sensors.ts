import mongoose from 'mongoose';
//user schema that defines the entity
const storesSchema = new mongoose.Schema({
    // define type, required (the most important)
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true});

export default mongoose.model('Stores', storesSchema); //Export data formatting