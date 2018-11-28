const server = require('../src/server');

const commands = {
    echo: (msg) => {
        var msgTxt = msg.text.substr(msg.text.indexOf(' ') + 1);
        server.sendMessage({
            "chat_id": msg.chat.id,
            "text": msgTxt || 'is empty'
        }).catch((e) => { console.log(e) });
    },

    test: (msg) => {
        var msgTxt = msg.text.substr(msg.text.indexOf(' ') + 1);
        server.sendMessage({
            "chat_id": msg.chat.id,
            "reply_to_message_id": msg.message_id,
            "text": msgTxt || 'is empty'
        }).catch((e) => { console.log(e) });
    }
}

function processMessage(messageObj) {
    const message = messageObj.message || messageObj.edited_message;
    if (message.entities && message.entities[0].type == 'bot_command') {
        var start = 1,
            end = message.text.indexOf(' ');

        var command = message.text.substring(start, end > 1 ? end : message.text.length);
        if (commands.hasOwnProperty(command)) {
            commands[command](message);
        } else {
            console.log('unknown command: ' + command);
        }
    } 

}

function processMessages(messages) {
    messages.forEach((message) => {
        setImmediate(() => {
            processMessage(message);
        });
    });
}

exports.processMessages = processMessages;