function randomize(min, max, skew) {

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
    return output;
}


function randomData(randomInput, min, max, skew){
    if (Math.random()<=0.05){
      return (randomize(min, max, skew) + randomInput);
    }
    return randomInput;
}

let randomInput = 21;

for(let i = 0; i < 1000; i++){
    randomInput = randomData(randomInput, -1, 1, 1);
    console.log(randomInput);
}


const tempData = (pastTemp: number) => {
	let temp:number = randomData(pastTemp, -2, 2, 1);
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

const getData = (pastData:any) => {
	let temperature = tempData(pastData.temperature);
	let light = lightData(pastData.light);
	let humidity = humidityData(pastData.humidity);
	let moisture = moistureData(pastData.moisture);

	let valuesToAdd = []
	if (!temperature == pastData.temperature){
		valuesToAdd.push({temperature: temperature});
	}
	if (!light == pastData.light){
		valuesToAdd.push({light: light});
	}
	if (!humidity == pastData.humidity){
		valuesToAdd.push({humidity: humidity});
	}
	if (!moisture == pastData.moisture){
		valuesToAdd.push({moisture: moisture});
	}

	var body:any;
	body.temperature = valuesToAdd[0];
	body.light = valuesToAdd[1];
	body.humidity = valuesToAdd[2];
	body.moisture = valuesToAdd[3];
	// body = comination of values to add
	return body;
}

