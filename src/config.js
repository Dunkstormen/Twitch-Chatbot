require('dotenv').config()

/**
 * @typedef EnvironmentConfiguration
 * @prop {string} BOT_USERNAME - Username of the Twitch bot
 * @prop {string} OAUTH_TOKEN - Twitch OAuth token for the bot
 * @prop {string} CHANNEL_NAME - Name of the channel the bot should join
 * @prop {boolean} DEBUG - Enable/Disable debug for TMI.JS
 */

/**
 * @type {EnvironmentConfiguration}
 */

const config = {
  ...process.env
}

module.exports = config
