/*
    * CommandTitle: "Echo"
    * CommandSubtitle: "Makes the bot say a specific message."
    * CommandParameters: "Message"
*/

module.exports = async (incomingMessage, commandArguments) => {
    try {
        const echoMessage = commandArguments.join(" ");
        if (echoMessage.length > 0) {
            incomingMessage.channel.send(echoMessage);
        } else {
            incomingMessage.reply("You must provide something to echo.");
        }
    } catch (error) {
        console.error(`${error}`);
        try {
            incomingMessage.reply(`${error}`);
        } catch (error) {
            console.error(`${error}`);
        }
    }
}