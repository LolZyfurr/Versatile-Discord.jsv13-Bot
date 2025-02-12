/*
    * CommandTitle: "Purge"
    * CommandSubtitle: "Mass deletes messages in a channel."
    * CommandParameters: "Number"
*/

function checkBotPermission(guild, permission) {
    const botMember = guild.me;
    const botPermissions = botMember.permissions;
    const hasPermission = botPermissions.has(permission || "ADMINISTRATOR");
    return hasPermission;
}

function checkUserPermission(user, guild, permission) {
    const userMember = guild.members.resolve(user);
    const userPermissions = userMember.permissions;
    const hasPermission = userPermissions.has(permission || "ADMINISTRATOR");
    return hasPermission;
}

function replaceAllInstances(text, search, replacement) {
    return text.replace(new RegExp(search, 'gi'), replacement);
}

module.exports = async (incomingMessage, commandArguments) => {
    const noPermissionMessages = [
        "{invalidPerm} is not authorized to {invalidAction} this channel.",
        "Sorry, {invalidPerm} lacks the necessary permissions.",
        "Permission denied for {invalidPerm}.",
        "Action cannot be completed: {invalidPerm} lacks the required permissions.",
        "{invalidPerm} is not permitted to {invalidAction} this channel.",
        "Insufficient permissions for {invalidPerm} to carry out this action.",
        "The action was blocked because {invalidPerm} does not have the right permissions.",
        "Unfortunately, {invalidPerm} does not have the authority to perform this action.",
        "{invalidPerm} is not allowed to {invalidAction} channels due to insufficient permissions."
    ];

    const commandAction = "purge";
    const { guild: messageGuild, author: messageAuthor, client: botClient } = incomingMessage;
    const userPermissions = checkUserPermission(messageAuthor, messageGuild, "BAN_MEMBERS");
    const botPermissions = checkBotPermission(messageGuild, "BAN_MEMBERS");

    if (messageGuild && userPermissions && botPermissions) {
        const numMessages = parseInt(commandArguments[0]);
        if (isNaN(numMessages) || numMessages < 1 || numMessages > 100) {
            return await incomingMessage.reply('Please provide a valid number between 1 and 100 for the number of messages to delete.');
        }
        const limit = Math.min(numMessages, 100);
        try {
            const fetchedMessages = await incomingMessage.channel.messages.fetch({
                limit: limit,
                before: incomingMessage.id
            });
            await incomingMessage.reply(`Successfully deleted ${fetchedMessages.size} messages.`);
            await incomingMessage.channel.bulkDelete(fetchedMessages, true);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}]:`, error);
            await incomingMessage.reply('An error occurred while deleting the messages.');
        }
    } else {
        const noPermissionMessage = noPermissionMessages[Math.floor(Math.random() * noPermissionMessages.length)];
        let permissionFail = userPermissions ? (botClient.user.tag) : (messageAuthor.tag);
        let errorMessage = replaceAllInstances(replaceAllInstances(noPermissionMessage, "{invalidPerm}", permissionFail), "{invalidAction}", commandAction);
        incomingMessage.reply(errorMessage);
    }
};