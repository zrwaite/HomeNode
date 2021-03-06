import mongoose from 'mongoose';
//user schema that defines the entity
const homeSettingsSchema = new mongoose.Schema({
    intrusion_detection : {
        type: Boolean,
        required: true,
    },
    safety_level : {
        type: Number,
        required: true
    }
}, {timestamps: true});

const homeModulesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    module_id : {
        type: mongoose.Types.ObjectId,
        required: false,
    },
}, {timestamps: false});

const homeNotificationsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    module_id : {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    info : {
        type: String,
        required: true,
    },
    read : {
        type: Boolean,
        required: false,
        default: false
    },
}, {timestamps: true});

const homeSchema = new mongoose.Schema({
    // define type, required (the most important)
    name: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    users: {
        type: [String],
        required: false,
        default: [],
    },  
    settings: {
        type: homeSettingsSchema,
        required: false,
        default: {},
    },
    modules: {
        type: [homeModulesSchema],
        required: false,
        default: [],
    },
    notifications: {
        type: [homeNotificationsSchema],
        required: false,
        default: [],
    },
}, { timestamps: true});

export default mongoose.model('Home', homeSchema); //Export data formatting