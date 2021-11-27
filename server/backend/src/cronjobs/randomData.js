"use strict";
exports.__esModule = true;
exports.getIntruderData = exports.getPlantData = exports.getSensorData = void 0;
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
    //console.log(Math.round(output))
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
    //console.log(randomInput);
}
var tempData = function (pastTemp) {
    var temp = randomData(pastTemp, -3, 3, 1);
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
var waterCounter = function (pastWaterCounter) {
    var waterCount = randomData(pastWaterCounter, -1, 1, 1);
    while (waterCount < 0) {
        waterCount = randomData(pastWaterCounter, -1, 1, 1);
    }
    return waterCount;
};
var alertLevel = function (pastAlert) {
    var alert = randomData(pastAlert, -3, 3, 1);
    while (alert < 1 || alert > 10) {
        alert = randomData(pastAlert, -3, 3, 1);
    }
    return alert;
};
var getSensorData = function (pastData) {
    var temperature = tempData(pastData.temperature);
    var humidity = humidityData(pastData.humidity);
    var valuesToAdd = {};
    if (temperature !== pastData.temperature) {
        valuesToAdd.temperature = Math.round(temperature);
    }
    if (humidity !== pastData.humidity) {
        valuesToAdd.humidity = Math.round(humidity);
    }
    return valuesToAdd;
};
exports.getSensorData = getSensorData;
var getPlantData = function (pastData) {
    var light = lightData(pastData.light);
    var moisture = moistureData(pastData.moisture);
    var waterCount = waterCounter(pastData.waterCount);
    var valuesToAdd = {};
    if (light !== pastData.light) {
        valuesToAdd.light = Math.round(light);
    }
    if (moisture !== pastData.moisture) {
        valuesToAdd.moisture = Math.round(moisture);
    }
    if (waterCount !== pastData.waterCount) {
        valuesToAdd.waterCount = Math.round(waterCount);
    }
    return valuesToAdd;
};
exports.getPlantData = getPlantData;
var getIntruderData = function (pastData) {
    var alert = alertLevel(pastData.alert);
    var valuesToAdd = {};
    if (alert !== pastData.alert) {
        valuesToAdd.alert = Math.round(alert);
    }
    return valuesToAdd;
};
exports.getIntruderData = getIntruderData;
