import mongoose from 'mongoose';
//user schema that defines the entity
const intrudersUpdateSchema = new mongoose.Schema({
    detection : {
        type: String,
        required: false,
    },
    alert_level : {
        type: Number,
        required: false,
    },
}, {timestamps: true});

const intrudersDailySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    intrusion_detections : {
        type: Boolean,
        required: false,
    },
    max_alert_level: {
        type: Number,
        required: false,
    }
}, {timestamps: true});

const intrudersSchema = new mongoose.Schema({
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
        type: intrudersUpdateSchema,
        required: false,
        default: {},
    },
    daily_data: {
        type: [intrudersUpdateSchema],
        required: false,
        default: [],
    },
    past_data: {
        type: [intrudersDailySchema],
        required: false,
        default: [],
    },
}, { timestamps: true});

export default mongoose.model('Intruders', intrudersSchema); //Export data formatting
