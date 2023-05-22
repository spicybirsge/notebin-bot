const express = require('express')
const app = express()
const ms = require('pretty-ms')
app.get('/', (req , res) => {
  res.send("ok")
})
app.listen(process.env.PORT || 3000)
const fetch = require('node-fetch')
const { Client, Collection } = require("discord.js")
const client = new Client({
    intents: ["GUILDS",
    
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    restTimeOffset: 0,
    allowedMentions: {
        parse: ['users']
    }
})
client.on("ready", () => {
  console.log("Bot is ready for notebin creation")
})

client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
   if(message.content.toLowerCase() === ".ping") {
      const l = await message.channel.send('Pinging...')
      const ping = l.createdTimestamp - message.createdTimestamp
      await l.edit(`Pong! (Websocket: ${client.ws.ping}ms. Roundtrip: ${ping}ms.)`)
    }
    if(message.content.toLowerCase() === ".uptime") {
  return message.channel.send(`I have been running for: ${ms(client.uptime)}`)
    }
  if(message.content.toLowerCase() === ".help") {
    return message.channel.send("**Commands**\n `.ping`, `.uptime`, `.help`, `.codebin`")
  }
  
    const args = message.content.split(" ").slice(1)
  if(message.content.toLocaleLowerCase().startsWith(".codebin")) {

  const text = args.join(" ")
    if(!text) return message.channel.send("Please provide a text.")
    const create = await fetch('https://notebin.cf/api/create', {
      method: 'POST',
      body: JSON.stringify({text: text}),
        headers: {
        "Content-Type": "application/json"
    }
    }).then(response => response.json()).then(async(data) => {
    if(data.url) {
        return message.channel.send(`Saved text to: ${data.url}`)
    } else {
      message.channel.send(`Something went wrong!`)
        return console.log(JSON.stringify(data.error[0].msg) || data)
    }
})
  }
})
client.login(process.env.token)
