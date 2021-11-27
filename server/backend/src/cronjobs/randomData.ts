
function randomize(min: number, max: number, skew: number) {

    let first = 0;
    let second = 0;
    while(first === 0) {
        first = Math.random();
    } 
    while(second === 0) {
        second = Math.random();
    }
    let output = Math.sqrt(-2.0*Math.log(first)) * Math.cos(2.0*Math.PI*second);
    output = output / 10.0 + 0.5; 
    if (output > 1 || output < 0) {
      output = randomize(min, max, skew); 
    }
    else{
      output = Math.pow(output, skew);
      output *= max - min;
      output += min;
    }
	//console.log(Math.round(output))
    return output;
}


function randomData(randomInput: number, min: number, max: number, skew: number){
    if (Math.random()<=0.05){
      return (randomize(min, max, skew) + randomInput);
    }
    return randomInput;
}

let randomInput = 21;

for(let i = 0; i < 1000; i++){
    randomInput = randomData(randomInput, -1, 1, 1);
    //console.log(randomInput);
}


const tempData = (pastTemp: number) => {
	let temp:number = randomData(pastTemp, -3, 3, 1);
	return temp;
}
const lightData = (pastLight: number) => {
	let light:number = randomData(pastLight, -5, 5, 1);
	return light;
}
const humidityData = (pastHumidity: number) => {
	let humidity:number = randomData(pastHumidity, -5, 5, 1);
	return humidity;
}
const moistureData = (pastMoisture: number) => {
	let moisture:number = randomData(pastMoisture, -5, 5, 1);
	return moisture;
}
const waterCounter = (pastWaterCounter: number) => {
	let waterCount:number = randomData(pastWaterCounter, -1, 1, 1);
	while(waterCount < 0){
		waterCount = randomData(pastWaterCounter, -1, 1, 1);
	}
	return waterCount;
}
const alertLevel = (pastAlert: number) => {
	let alert:number = randomData(pastAlert, -3, 3, 1);
	while(alert < 1 || alert > 10){
		alert = randomData(pastAlert, -3, 3, 1);
	}
	return alert;
}




const getSensorData = (pastData:any) => {
	let temperature = tempData(pastData.temperature);
	let humidity = humidityData(pastData.humidity);

	let valuesToAdd:any = {}
	if (temperature !== pastData.temperature){
		valuesToAdd.temperature = Math.round(temperature);
	}
	
	if (humidity !== pastData.humidity){
		valuesToAdd.humidity = Math.round(humidity);
	}
	return valuesToAdd;
}


const getPlantData = (pastData:any) => {
	let light = lightData(pastData.light);
	let moisture = moistureData(pastData.moisture);
	let waterCount = waterCounter(pastData.waterCount)

	let valuesToAdd:any = {}
	
	if (light !== pastData.light){
		valuesToAdd.light = Math.round(light);
	}
	if (moisture !== pastData.moisture){
		valuesToAdd.moisture = Math.round(moisture);
	}
	if (waterCount !== pastData.waterCount){
		valuesToAdd.waterCount = Math.round(waterCount);
	}
	return valuesToAdd;
}

const getIntruderData = (pastData:any) => {
	let alert = alertLevel(pastData.alert);

	let valuesToAdd:any = {}
	
	if (alert !== pastData.alert){
		valuesToAdd.alert = Math.round(alert);
	}
	
	return valuesToAdd;
}


export {getSensorData, getPlantData, getIntruderData};