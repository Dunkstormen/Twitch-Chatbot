require('dotenv').config()
const tmi = require('tmi.js')

// eslint-disable-next-line prefer-regex-literals
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)

// Options for the bot
const options = {
  options: {
    debug: process.env.DEBUG,
    messagesLogLevel: 'info'
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
}

const client = new tmi.Client(options)

// Register our event handlers (defined below)
client.on('connected', (address, port) => { onConnectedHandler(address, port) })
client.on('message', (channel, userstate, message, self) => { onMessageHandler(channel, userstate, message, self) })
client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => { subGiftHandler(channel, username, streakMonths, recipient, methods, userstate) })

// Connect to twitch
client.connect()

// Called every time a message comes in
function onMessageHandler (channel, userstate, message, self) {
  const isCommand = regexpCommand.test(message)

  if (self || userstate.username === process.env.BOT_USERNAME) { return }
  if (!isCommand) { return }

  // eslint-disable-next-line no-unused-vars
  const [raw, command, argurment] = message.match(regexpCommand)

  switch (command) {
    case 'ping':
      client.say(channel, 'Pong! POGGERS')
      break
    default:
      console.log(`Command ${command} does not exist!`)
      break
  }
}

function subGiftHandler (channel, username, streakMonths, recipient, methods, userstate) {
  console.log(`[EVENT] ${username} giftede ${recipient} et sub!`)
  client.say(channel, `${username} gav lige ${recipient} et sub! huckle1LOVE huckle1LOVE`)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}
