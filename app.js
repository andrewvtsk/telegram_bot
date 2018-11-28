const Events = require('events');

const config = require('./config/config'),
    server = require('./src/server'),
    handlers = require('./src/handlers');

var loopTimer;

global.lastUpdateId = 0;

const Emitter = new Events.EventEmitter();
Emitter.on('messages.updated', (messages) => {
    setImmediate(() => {
        handlers.processMessages(messages);
    });
})

async function tick() {
    var messages = await server.getUpdates().catch((e) => {console.log(e)});

    if (messages && messages.length > 0) {
        global.lastUpdateId = messages[messages.length - 1].update_id;
        Emitter.emit('messages.updated', messages);
    }
}

async function loop() {
    await tick();
    loopTimer = setTimeout(loop, config.period);
}

loop();