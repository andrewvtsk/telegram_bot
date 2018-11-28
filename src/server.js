const https = require('https'),
    Url = require('url');

const config = require('../config/config');

var url = new Url.URL(config.updatesUrl + 'bot' + config.token + '/');

var actions = {
    getUpdates: {
        action: 'getUpdates',
        data: {
            limit: config.limit,
            timeout: config.timeout,
            offset: 0
        }
    },
    sendMessage: {
        action: 'sendMessage'
    }
}

function getUpdates() {
    var updateUrl = url + actions['getUpdates'].action;
    var data = actions['getUpdates'].data;

    data.offset = global.lastUpdateId + 1;

    var jsonStr = JSON.stringify(data);

    return sendRequest(updateUrl, jsonStr).then(function (data) {
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
    var updateUrl = url + actions['getUpdates'].action;
    var jsonStr = JSON.stringify(data);

    return sendRequest(updateUrl, jsonStr).then(function (data) {
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
        req.write(data, 'raw');
        req.end();
    });
}

exports.getUpdates = getUpdates;
exports.sendMessage = sendMessage;