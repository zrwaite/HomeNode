"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var putPastData = function (id, intrusion_detections, max_alert_level) { return __awaiter(void 0, void 0, void 0, function () {
    var date, pastData, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date().toLocaleDateString().toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1["default"].put("/api/intruders?put_type=past_data", {
                        id: id,
                        date: date,
                        intrusion_detections: intrusion_detections,
                        max_alert_level: max_alert_level
                    })];
            case 2:
                pastData = _a.sent();
                result = pastData.data;
                if (result)
                    return [2 /*return*/];
                else
                    console.log("Error putting past data");
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log("Error putting past data", e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteDailyData = function (id, detection, alert_level) { return __awaiter(void 0, void 0, void 0, function () {
    var deleteData, result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"]["delete"]("/api/intruders?delete_type=daily_data", { data: {
                            id: id,
                            detection: detection,
                            alert_level: alert_level
                        } })];
            case 1:
                deleteData = _a.sent();
                result = deleteData.data;
                if (result)
                    return [2 /*return*/];
                else
                    console.log("Error deleting daily data");
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log("Delete error:");
                console.log(e_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var intruderCompress = function () { return __awaiter(void 0, void 0, void 0, function () {
    var allIntruders, intrudersArray, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"].get('/api/intruders?get_type=all')];
            case 1:
                allIntruders = _a.sent();
                intrudersArray = allIntruders.data.response.result;
                intrudersArray.forEach(function (module) {
                    var id = module._id;
                    var dailyData = module.daily_data;
                    var currentData = module.current_data;
                    var maxAlertLevel = 0;
                    var intrusionDetections = false;
                    dailyData.forEach(function (data) {
                        if (data.max_alert_level > maxAlertLevel)
                            maxAlertLevel = data.max_alert_level;
                        if (data.alert_level > 7)
                            intrusionDetections = true;
                    });
                    var success = true;
                    [maxAlertLevel, intrusionDetections].forEach(function (param) {
                        if (param === undefined)
                            success = false;
                    });
                    if (success)
                        putPastData(id, intrusionDetections, maxAlertLevel);
                    else
                        console.log("Error putting past data");
                    success = true;
                    ["detection", "alert_level"].forEach(function (param) {
                        if (currentData[param] == undefined)
                            success = false;
                    });
                    if (success)
                        deleteDailyData(id, currentData.detection, currentData.alert_level);
                    else {
                        console.log("Missing current data");
                        console.log(currentData);
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.log("Error getting intruder data");
                console.log(e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports["default"] = intruderCompress;
