import mongoose from 'mongoose';
//user schema that defines the entity
const plantsDailySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    average_moisture : {
        type: Number,
        required: true,
    },
    average_light_level : {
        type: Number,
        required: true,
    },
    num_waters : {
        type: Number,
        required: true,
    },
}, {timestamps: true});

const plantsUpdateSchema = new mongoose.Schema({
    moisture : {
        type: Number,
        required: false,
    },
    light_level : {
        type: Number,
        required: false,
    },
    num_waters : {
        type: Number,
        required: false,
    },
    light_on: {
        type: Boolean,
        required: false,
    }
}, {timestamps: true});

const plantsSchema = new mongoose.Schema({
    // define type, required (the most important)
    name: {
        type: String,
        required: true,
    },
    home_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
    },
    current_data: {
        type: plantsUpdateSchema,
        required: true,
        default: {},
    },
    daily_data: {
        type: [plantsUpdateSchema],
        required: true,
        default: [],
    },
    past_data: {
        type: [plantsDailySchema],
        required: true,
        default: [],
    },
}, { timestamps: true});

export default mongoose.model('Plants', plantsSchema); //Export data formatting
