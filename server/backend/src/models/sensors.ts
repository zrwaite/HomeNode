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
    username: {
        type: String,
        required: true,
    },
    current_data: sensorsUpdateSchema,
    daily_data: [sensorsUpdateSchema],
    past_data: [sensorsDailySchema],
}, { timestamps: true});

export default mongoose.model('Sensors', sensorsSchema); //Export data formatting

/*
"timestamp": 12392938490,
			"temperature": 20,
			"humidity": 20,
			"light_level": 20
*/
