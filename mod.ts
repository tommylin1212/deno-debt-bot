import { createBot, Intents, startBot,CreateMessage } from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import { dotEnvConfig } from './deps.ts'
dotEnvConfig({ export: true });
const bot = createBot({
  token: Deno.env.get("DISCORD_TOKEN")||"",
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
  },
});

// Another way to do events
bot.events.messageCreate = async function (b, message) {
  // Process the message here with your command handler.
  if(message.content.includes('money')){
    const jsonResponse = await fetch("https://www.treasurydirect.gov/NP_WS/debt/current");
    const jsonData = await jsonResponse.json();
    const usPop= 336198413
    let ourDebt=jsonData.totalDebt
    let phrase="The current national debt is"
    if (message.mentionedUserIds.length){
        ourDebt=(ourDebt/usPop)*message.mentionedUserIds.length
        phrase="The current national debt for the people mentioned is"
    }
    
    ourDebt=new Intl.NumberFormat('en-Us', { style: 'currency', currency: 'USD' }).format(ourDebt)
    
    bot.helpers.sendMessage(message.channelId,{content: phrase+": "+ourDebt})
    
  }
};

await startBot(bot);