const { Client, Intents } = require("discord.js");
const { botToken, botOwner } = require("../Config/Information.json");
const { botPrefix } = require("../Config/Settings.json");

const client = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });

function setBotStatus(statusMessage) {
    client.user.setActivity({
        name: statusMessage,
        type: "PLAYING"
    });
}

function hasBotPermission(guild, permission) {
    const botUser = guild.me;
    const botPermissions = botUser.permissions;
    const hasPermission = botPermissions.has(permission || "ADMINISTRATOR");
    return hasPermission;
}

function loadCommandModule(modulePath) {
    try {
        delete require.cache[require.resolve(modulePath)];
        return require(modulePath);
    } catch (error) {
        return null
    }
}

function replaceAllInstances(text, search, replacement) {
    return text.replace(new RegExp(search, 'gi'), replacement);
}

client.on("ready", () => {
    console.clear();
    console.log(`Logged in as: ${client.user.tag}`);
});

client.on("messageCreate", async (incomingMessage) => {
    if (incomingMessage.author.id === client.user.id) {return}
    const testingMode = loadCommandModule("../Config/Settings.json").botTestingMode;
    if (!testingMode || incomingMessage.author.id === botOwner) {
        const commandNotFoundMessage = "The command `{commandPrefix}` does not exist."
        let { content: messageContent } = incomingMessage;
        let messageParts = messageContent.split(" ");
        let commandName = messageParts[0].slice(botPrefix.length).toLowerCase();
        let commandArguments = messageParts.slice(1);

        if (messageContent.startsWith(botPrefix)) {
            let commandModule = loadCommandModule(`../Modules/${commandName}.js`);
            if (commandModule) {
                commandModule(incomingMessage, commandArguments);
            } else {
                let errorMessage = replaceAllInstances(commandNotFoundMessage, "{commandPrefix}", commandName);
                incomingMessage.reply(errorMessage);
            }
        }
    }
});

client.login(botToken);
