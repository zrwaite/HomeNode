import mongoose from 'mongoose';
//user schema that defines the entity
const sensorsUpdateSchema = new mongoose.Schema({
    temperature : {
        type: Number,
        required: false,
    },
    humidity : {
        type: Number,
        required: false,
    },
    light_level : {
        type: Number,
        required: false,
    },
}, {timestamps: true});

const sensorsDailySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    average_temperature : {
        type: Number,
        required: false,
    },
    average_humidity : {
        type: Number,
        required: false,
    },
    average_light_level : {
        type: Number,
        required: false,
    },
}, {timestamps: true});

const sensorsSchema = new mongoose.Schema({
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
        type: sensorsUpdateSchema,
        required: false,
        default: {},
    },
    daily_data: {
        type: [sensorsUpdateSchema],
        required: false,
        default: [],
    },
    past_data: {
        type: [sensorsDailySchema],
        required: false,
        default: [],
    },
}, { timestamps: true});

export default mongoose.model('Sensors', sensorsSchema); //Export data formatting