import mongoose from 'mongoose';
//user schema that defines the entity
const userSettingsSchema = new mongoose.Schema({
    dark_mode : {
        type: Boolean,
        required: true,
    },
    email_notifications : {
        type: Boolean,
        required: true,
    }
}, {timestamps: true});

const userSchema = new mongoose.Schema({
    // define type, required (the most important)
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    }, 
    home_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    settings: {
        type: userSettingsSchema,
        required: false,
        default: {},
    },
}, { timestamps: true});

export default mongoose.model('User', userSchema); //Export data formatting