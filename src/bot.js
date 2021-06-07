const tmi = require('tmi.js')
const config = require('./config')

// eslint-disable-next-line prefer-regex-literals
const regexpCommand = new RegExp(/^!([a-zA-Z0-9æøåÆØÅ]+)(?:\W+)?(.*)?/)

// Options for the bot
const options = {
  options: {
    debug: config.DEBUG,
    messagesLogLevel: 'info'
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.BOT_USERNAME,
    password: config.OAUTH_TOKEN
  },
  channels: [config.CHANNEL_NAME]
}

const client = new tmi.Client(options)

// Register our event handlers (defined below)
client.on('connected', (address, port) => { onConnectedHandler(address, port) })
client.on('message', (channel, userstate, message, self) => { onMessageHandler(channel, userstate, message, self) })
client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => { subGiftHandler(channel, username, streakMonths, recipient, methods, userstate) })

// Connect to twitch
client.connect()

/**
 * Called everytime a message is sent in the channel
 * @param {string} channel - Channel message was sent in
 * @param {import('tmi.js').ChatUserstate} userstate - Userstate of the message
 * @param {string} message - Message sent in channel
 * @param {boolean} self - Message sent by onMessageHandler
 */
function onMessageHandler (channel, userstate, message, self) {
  const isCommand = regexpCommand.test(message)

  if (self || userstate.username.toLowerCase() === config.BOT_USERNAME.toLowerCase()) { return }
  if (!isCommand) { return }

  // eslint-disable-next-line no-unused-vars
  const [raw, command, argurment] = message.match(regexpCommand)

  // TODO: Create a database for commands, instead of them being hardcoded into the bot
  switch (command.toLowerCase()) {
    case 'ping':
      client.say(channel, 'Pong! POGGERS')
      break
      /* case 'merch':
      client.say(channel, 'LET\'S GOOOOO FAM! HOP IND OG KØB EN T-SHIRT, ET MUNDBIND ELLER DIN YNDLINGSHOODIE! DU STØTTER MIG SAMTIDIG :heart: :heart: :heart: https://huckle.tv/')
      break */
      /* case 'nytnytnyt':
      client.say(channel, '!nymobil !nyeram og så en ny mobilholder.')
      break */
    default:
      console.log(`Command ${command} does not exist!`)
      break
  }
}

/**
 * Called everytime someone gifts a sub in the channel
 * @param {string} channel - Channel message was sent in
 * @param {string} username - Username of the user gifting the subscription
 * @param {integer} streakMonths - Recipients current streak
 * @param {string} recipient - Username of the user recieving the gifted subscription
 * @param {*} methods - TODO
 * @param {import('tmi.js').ChatUserstate} userstate - Userstate for the gifted subscription
 */
function subGiftHandler (channel, username, streakMonths, recipient, methods, userstate) {
  console.log(`[EVENT] ${username} giftede ${recipient} et sub!`)
  client.say(channel, `${username} gav lige ${recipient} et sub! huckle1LOVE huckle1LOVE`)
}

/**
 * Called everytime a succesful connection is made to Twitch
 * @param {string} addr - Remote address
 * @param {integer} port - Remote port
 */
function onConnectedHandler (addr, port) {
  console.log(`[CONNECTION] Connected to ${addr}:${port}`)
}
