/*
    * CommandTitle: "Help"
    * CommandSubtitle: "Lists all of the available commands!"
    * CommandParameters: ""
*/

const { Message } = require('discord.js');
const fileSystem = require('fs');
const path = require('path');

function extractCommandDetails(filePath) {
    const fileData = fileSystem.readFileSync(filePath, 'utf8');
    const fileLines = fileData.split('\n');
    let commandDetails = {};

    for (let line of fileLines) {
        if (line.startsWith('/*')) {
            continue;
        } else if (line.startsWith('*/')) {
            break;
        } else {
            const splitLine = line.split(':');
            const key = splitLine[0].trim().substring(2);
            const value = splitLine[1].trim().replace(/"/g, '');
            commandDetails[key] = value;
        }
    }

    return commandDetails;
}

function replaceAllInstances(text, search, replacement) {
    return text.replace(new RegExp(search, 'gi'), replacement);
}

module.exports = async (incomingMessage, commandArguments) => {
    try{
        const helpMessageTemplate = "## {commandName} \n- Parameters: `<{commandParameters}>`\n- Description: {commandDescription}\n"
        const modulesDirectory = "../Modules"
        const directoryPath = path.join(__dirname, modulesDirectory);
        const files = fileSystem.readdirSync(directoryPath);
        let helpMessage = "";

        files.forEach(function (file) {
            let commandValues = extractCommandDetails(path.join(directoryPath, file));
            let commandTitle = commandValues.CommandTitle;
            let commandParameters = commandValues.CommandParameters;
            let commandDescription = commandValues.CommandSubtitle;
            let commandMessage = replaceAllInstances(replaceAllInstances(replaceAllInstances(helpMessageTemplate, "{commandName}", commandTitle), "{commandParameters}", commandParameters), "{commandDescription}", commandDescription);
            helpMessage += commandMessage + "\n";
        });

        incomingMessage.reply(helpMessage);
    } catch (error) {
        console.error(`${error}`);
        try {
            incomingMessage.reply(`${error}`);
        } catch (error) {
            console.error(`${error}`);
        }
    }
};