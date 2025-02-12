/*
    * CommandTitle: "Ban"
    * CommandSubtitle: "Bans a specified user!"
    * CommandParameters: "User, Reason"
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
        "{invalidPerm} is not authorized to {invalidAction} that user.",
        "Sorry, {invalidPerm} lacks the necessary permissions.",
        "Permission denied for {invalidPerm}.",
        "Action cannot be completed: {invalidPerm} lacks the required permissions.",
        "{invalidPerm} is not permitted to {invalidAction} that user.",
        "Insufficient permissions for {invalidPerm} to carry out this action.",
        "The action was blocked because {invalidPerm} does not have the right permissions.",
        "Unfortunately, {invalidPerm} does not have the authority to perform this action.",
        "{invalidPerm} is not allowed to {invalidAction} users due to insufficient permissions."
    ];

    const commandAction = "ban";
    const { guild: messageGuild, author: messageAuthor, client: botClient } = incomingMessage;
    const userPermissions = checkUserPermission(messageAuthor, messageGuild, "BAN_MEMBERS");
    const botPermissions = checkBotPermission(messageGuild, "BAN_MEMBERS");

    if (messageGuild && userPermissions && botPermissions) {
        incomingMessage.reply("ban!");
    } else {
        const noPermissionMessage = noPermissionMessages[Math.floor(Math.random() * noPermissionMessages.length)];
        let permissionFail = userPermissions ? (botClient.user.tag) : (messageAuthor.tag);
        let errorMessage = replaceAllInstances(replaceAllInstances(noPermissionMessage, "{invalidPerm}", permissionFail), "{invalidAction}", commandAction);
        incomingMessage.reply(errorMessage);
    }
};
