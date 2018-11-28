const server = require('../src/server');

const commands = {
    echo: (msg) => {
        server.sendMessage({
            "chat_id": msg.chat.id,
            "reply_to_message_id": msg.message_id,
            "text": msg.text.substr(msg.text.indexOf(' ') + 1)
        });
    }
}

function processMessage(message) {
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
    messages.forEach((messageObj) => {
        setImmediate(() => {
            processMessage(messageObj.message);
        });
    });
}

exports.processMessages = processMessages;