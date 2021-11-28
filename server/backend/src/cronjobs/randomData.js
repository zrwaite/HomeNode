function randomize(min, max, skew) {
    var first = 0;
    var second = 0;
    while (first === 0) {
        first = Math.random();
    }
    while (second === 0) {
        second = Math.random();
    }
    var output = Math.sqrt(-2.0 * Math.log(first)) * Math.cos(2.0 * Math.PI * second);
    output = output / 10.0 + 0.5;
    if (output > 1 || output < 0) {
        output = randomize(min, max, skew);
    }
    else {
        output = Math.pow(output, skew);
        output *= max - min;
        output += min;
    }
    return output;
}
function randomData(randomInput, min, max, skew) {
    if (Math.random() <= 0.05) {
        return (randomize(min, max, skew) + randomInput);
    }
    return randomInput;
}
var randomInput = 21;
for (var i = 0; i < 1000; i++) {
    randomInput = randomData(randomInput, -1, 1, 1);
    console.log(randomInput);
}
var tempData = function (pastTemp) {
    var temp = randomData(pastTemp, -2, 2, 1);
    return temp;
};
var lightData = function (pastLight) {
    var light = randomData(pastLight, -5, 5, 1);
    return light;
};
var humidityData = function (pastHumidity) {
    var humidity = randomData(pastHumidity, -5, 5, 1);
    return humidity;
};
var moistureData = function (pastMoisture) {
    var moisture = randomData(pastMoisture, -5, 5, 1);
    return moisture;
};
var getData = function (pastData) {
    var temperature = tempData(pastData.temperature);
    var light = tempData(pastData.light);
    var humidity = tempData(pastData.humidity);
    var moisture = tempData(pastData.moisture);
    var valuesToAdd = [];
    if (!temperature == pastData.temperature) {
        valuesToAdd.push({ temperature: temperature });
    }
    if (!light == pastData.light) {
        valuesToAdd.push({ light: light });
    }
    if (!humidity == pastData.humidity) {
        valuesToAdd.push({ humidity: humidity });
    }
    if (!moisture == pastData.moisture) {
        valuesToAdd.push({ moisture: moisture });
    }
    //repeat
    // body = comination of values to add
    // return body;
};
