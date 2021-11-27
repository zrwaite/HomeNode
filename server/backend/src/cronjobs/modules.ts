import {getSensorData, getPlantData, getIntruderData} from "./randomData";

//only for temp and humidity
const sensorsModule = async (pastData:any) => {
    let obj = await getSensorData(pastData);

    if(obj.temperature != undefined){
        pastData.temperature = obj.temperature;
    }
    if(obj.humidity != undefined){
        pastData.humidity = obj.humidity;
    }

    return  pastData;
}

//only for plants
const plantsModule = async (pastData: any) => {
    let obj = await getPlantData(pastData);

    if(obj.moisture != undefined){
        pastData.moisture = obj.moisture;
    }
    if(obj.light != undefined){
        pastData.light = obj.light;
    }
    if(obj.waterCount != undefined){
        pastData.waterCount = obj.waterCount;
    }

    return  pastData;
}

//only for intruders
const intrudersModule = async (pastData: any) => {
    let obj = await getIntruderData(pastData);

    if(obj.alert != undefined){
        pastData.alert = obj.alert;
    }
    return  pastData;
}


const allModules = async (pastData: any) => {

    Object.assign(pastData, sensorsModule(pastData))
    Object.assign(pastData, plantsModule(pastData))

    Object.assign(pastData, intrudersModule(pastData))

//     pastData = sensorsModule(pastData)
//    pastData = plantsModule(pastData)
//     pastData = intrudersModule(pastData)

    // pastData = sensorsModule(pastData)
    // pastData = plantsModule(pastData)
    // pastData = intrudersModule(pastData)
    // if (obj === pastData) {
    //     return {}
    // }
    return pastData;
}

export {sensorsModule, plantsModule, intrudersModule, allModules}

