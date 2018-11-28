const https = require('https');
const config = require('../config/config');
const actions = {
    getUpdates: {
        options: {
            hostname: config.hostName,
            path: '/bot' + config.token + '/getUpdates',
            method: 'POST'
        },
        data: {
            limit: config.limit,
            timeout: config.timeout,
            offset: 0
        }
    },

    sendMessage: {
        options: {
            hostname: config.hostName,
            path: '/bot' + config.token + '/sendMessage',
            method: 'POST'
        }
    }
}

function getUpdates() {
    const options = actions['getUpdates'].options,
        data = actions['getUpdates'].data;

    data.offset = global.lastUpdateId + 1;

    return sendRequest(options, data).then(function (data) {
        return new Promise((resolve, reject) => {
            try {
                const resObj = JSON.parse(data.body);

                resolve(resObj['result']);
            } catch(e) {
                reject(e);
            }
        })
    })
}

function sendMessage(data) {
    const options = actions['sendMessage'].options;

    return sendRequest(options, data).then(function (data) {
        return new Promise((resolve, reject) => {
            try {
                const resObj = JSON.parse(data.body);

                resolve(resObj['result']);
            } catch (e) {
                reject(e);
            }
        })
    })
}

function sendRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => (body += chunk.toString()));
            res.on('error', reject);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve({ statusCode: res.statusCode, headers: res.headers, body: body });
                } else {
                    reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
                }
            });
        });

        req.setHeader('Content-Type', 'application/json');
        req.on('error', reject);
        req.write(JSON.stringify(data), 'raw');
        req.end();
    });
}

exports.getUpdates = getUpdates;
exports.sendMessage = sendMessage;