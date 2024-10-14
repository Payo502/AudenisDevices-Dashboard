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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var codec = require('@adeunis/codecs');
var sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
var currentPage = 2;
var processedPayloads = new Set();
// Constants
var BASE_URL = process.env.BASEURL;
var TOKEN_TYPE = 'Bearer';
var LOGIN_URL = "".concat(BASE_URL, "/application/login");
function getDataUp(token, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var fields, page, pageSize, sort, headers, params, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = options.fields, page = options.page, pageSize = options.pageSize, sort = options.sort;
                    headers = {
                        'Authorization': "".concat(TOKEN_TYPE, " ").concat(token),
                        'Accept': 'application/json,application/vnd.kerlink.iot-v1+json',
                    };
                    params = {
                        fields: fields,
                        page: page,
                        pageSize: pageSize,
                        sort: sort,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(BASE_URL, "/application/dataUp"), {
                            headers: headers,
                            params: params,
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status === 200) {
                        return [2 /*return*/, response.data];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error retrieving data up:', error_1.message);
                    if (error_1 && error_1.response) {
                        console.error('Server response:', error_1.response.data || error_1.response.statusText);
                    }
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function decodePayload(payloadValue) {
    var productTypes = ['comfortCo2', 'motion', 'breath'];
    var decoder = new codec.Decoder();
    for (var _i = 0, productTypes_1 = productTypes; _i < productTypes_1.length; _i++) {
        var productType = productTypes_1[_i];
        //console.log(`Decoding ${productType} frame => ${payloadValue}`);
        decoder.setDeviceType(productType);
        var parserResult = void 0;
        try {
            parserResult = decoder.decode(payloadValue);
            if (!parserResult.error && parserResult.type !== "Unsupported") {
                return JSON.stringify(parserResult, null, 2);
            }
        }
        catch (e) {
            console.error("Error decoding ".concat(productType, ":"), e);
        }
    }
    return 'Unsupported payload format or decoding error.';
}
function getJwtToken() {
    return __awaiter(this, void 0, void 0, function () {
        var loginHeaders, userDto, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loginHeaders = {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    };
                    userDto = {
                        login: process.env.KERLINK_LOGIN,
                        password: process.env.KERLINK_PASSWORD,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post(LOGIN_URL, userDto, { headers: loginHeaders })];
                case 2:
                    response = _a.sent();
                    if (response.status === 201) {
                        return [2 /*return*/, response.data.token]; // You might need to adjust this based on the exact JWT token's location in the response object.
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error during login:', error_2.message);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchAndDecode() {
    return __awaiter(this, void 0, void 0, function () {
        var token, options, dataUpResponse, processedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJwtToken()];
                case 1:
                    token = _a.sent();
                    console.log('Retrived JWT Token:', token);
                    if (!token) {
                        console.error('Token is not provided or is undefined.');
                        return [2 /*return*/];
                    }
                    options = {
                        fields: 'id,payload',
                        search: {
                            operand: 'pushed',
                            operation: 'EQ',
                            values: ['false'],
                        },
                        page: currentPage.toString(),
                        //pageSize: '100', // Fetch maximum possible data.
                    };
                    return [4 /*yield*/, getDataUp(token, options)];
                case 2:
                    dataUpResponse = _a.sent();
                    if (!dataUpResponse || !dataUpResponse.list) {
                        console.error('Failed to fetch data up.');
                        return [2 /*return*/];
                    }
                    processedData = dataUpResponse.list.map(function (item) {
                        if (item.payload && !processedPayloads.has(item.payload)) { // Check if payload is already processed
                            var decodedPayload = decodePayload(item.payload);
                            if (decodedPayload !== 'Unsupported payload format or decoding error.') {
                                item.decodedPayload = decodedPayload;
                                processedPayloads.add(item.payload); // Add payload to the set
                                return extractRelevantData(item);
                            }
                        }
                        return null;
                    }).filter(Boolean);
                    processedData.sort(function (a, b) { return (b.timestamp > a.timestamp) ? 1 : -1; }); // Sort by timestamp in descending order
                    insertDataIntoDb(processedData);
                    //console.log('Processed data:', JSON.stringify(processedData, null, 2));
                    console.log('Processed data:', processedData);
                    if (currentPage > 1) {
                        currentPage--;
                    }
                    setPollingInterval();
                    return [2 /*return*/];
            }
        });
    });
}
function extractRelevantData(data) {
    var parsedData = JSON.parse(data.decodedPayload);
    // List of potential keys we are interested in
    var keysOfInterest = ["co2", "tvoc", "pm10", "pm25", "pm1", "presence", "luminosity", 'temperature', 'humidity'];
    var results = {
        id: data.id,
        timestamp: new Date().toISOString(),
    };
    for (var _i = 0, keysOfInterest_1 = keysOfInterest; _i < keysOfInterest_1.length; _i++) {
        var key = keysOfInterest_1[_i];
        if (parsedData[key]) {
            results[key] = {
                values: parsedData[key].values
            };
        }
    }
    return results;
}
function insertDataIntoDb(data) {
    var isTransactionActive = false;
    db.serialize(function () {
        db.run('BEGIN TRANSACTION', [], function (error) {
            if (error) {
                console.error('Error beginning transaction:', error.message);
                return;
            }
            isTransactionActive = true;
            data.forEach(function (element) {
                db.run("INSERT INTO sensordata (id, timestamp, co2, tvoc, pm10, pm25, pm1, presence, luminosity, temperature, humidity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [element.id, element.timestamp,
                    element.co2 ? element.co2.values[0] : null,
                    element.tvoc ? element.tvoc.values[0] : null,
                    element.pm10 ? element.pm10.values[0] : null,
                    element.pm25 ? element.pm25.values[0] : null,
                    element.pm1 ? element.pm1.values[0] : null,
                    element.presence ? element.presence.values[0] : null,
                    element.luminosity ? element.luminosity.values[0] : null,
                    element.temperature ? element.temperature.values[0] : null,
                    element.humidity ? element.humidity.values[0] : null], function (error) {
                    if (error) {
                        console.error("Error inserting data into db: ".concat(error.message));
                        db.run('ROLLBACK');
                    }
                });
                //Inserting Temparature Values into DB
                if (element.temperature && Array.isArray(element.temperature.values)) {
                    element.temperature.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, temperature) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting temperature into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting Humidity Values into DB
                if (element.humidity && Array.isArray(element.humidity.values)) {
                    element.humidity.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, humidity) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting humidity into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting Luminosity Values into DB
                if (element.luminosity && Array.isArray(element.luminosity.values)) {
                    element.luminosity.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, luminosity) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting luminosity into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting Presence Values into DB
                if (element.presence && Array.isArray(element.presence.values)) {
                    element.presence.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, presence) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting presence into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting PM1 Values into DB
                if (element.pm1 && Array.isArray(element.pm1.values)) {
                    element.pm1.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp,pm1) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting pm1 into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting PM25 Values into DB
                if (element.pm25 && Array.isArray(element.pm25.values)) {
                    element.pm25.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, pm25) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting pm25 into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting PM10 Values into DB
                if (element.pm10 && Array.isArray(element.pm10.values)) {
                    element.pm10.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, pm10) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting pm10 into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting TVOC Values into DB
                if (element.tvoc && Array.isArray(element.tvoc.values)) {
                    element.tvoc.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, tvoc) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting tvoc into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
                //Inserting CO2 Values into DB
                if (element.co2 && Array.isArray(element.co2.values)) {
                    element.co2.values.forEach(function (value) {
                        db.run("INSERT INTO sensordata (id, timestamp, co2) VALUES (?, ?, ?)", [element.id, element.timestamp, value], function (error) {
                            if (error) {
                                console.error("Error inserting co2 into db: ".concat(error.message));
                                if (isTransactionActive) {
                                    db.run('ROLLBACK');
                                }
                            }
                        });
                    });
                }
            });
            db.run('COMMIT', [], function (error) {
                if (error) {
                    console.error("Error committing transaction: ".concat(error.message));
                    if (isTransactionActive) {
                        db.run('ROLLBACK');
                    }
                }
                else {
                    console.log('Data insertion completed successfully.');
                }
            });
        });
    });
}
const getSensorData = async (req, res) => {
    const { sensorType } = req.params;
    try {
        const query = `SELECT id, timestamp, ${sensorType} FROM sensordata WHERE ${sensorType} IS NOT NULL`;
        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred', error: err.message });
            }
            if (rows && rows.length > 0) {
                return res.json(rows);
            } else {
                return res.status(404).json({ message: 'No data found' });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

var db = new sqlite3.Database('./sensordata.db');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS sensordata (id TEXT, timestamp TEXT, co2 TEXT, tvoc TEXT, pm10 TEXT, pm25 TEXT, pm1 TEXT, presence TEXT, luminosity TEXT, temperature TEXT, humidity TEXT)");
});
var POLL_INTERVAL = 0;
var intervalId;
var hasRefreshedOnPageOne = false;
function setPollingInterval() {
    console.log("Entering setPollingInterval with currentPage:", currentPage);
    if (currentPage == 1) {
        if (!hasRefreshedOnPageOne) {
            POLL_INTERVAL = 5000; // 5 seconds for one-time refresh
            hasRefreshedOnPageOne = true;
        }
        else {
            POLL_INTERVAL = 600000; // 10 minutes
        }
    }
    else {
        POLL_INTERVAL = 5000; // 5 seconds
    }
    // Clear the existing interval
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Set the new interval with the updated polling time
    intervalId = setInterval(fetchAndDecode, POLL_INTERVAL);
}
setPollingInterval();

module.exports = {
    getSensorData: getSensorData
};