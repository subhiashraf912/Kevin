type bot = {
  name: string;
  owner: string;
  token: string;
  prefix: string;
};

import configs from "../configs.json";
const bots = configs.bots as bot[];
import processManager from "pm2";

const mongodb =
  "mongodb+srv://admin:4Z12t2TYyBQGdPmT@hentai.klm1z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
bots.forEach((element) => {
  const botName = element.name;
  const botPrefix = element.prefix;
  const botToken = element.token;
  const mainOwner = element.owner;
  processManager.start(
    {
      name: botName,
      script: "dist/src/Bot/index.js",
      env: {
        BOT_TOKEN: botToken,
        BOT_PREFIX: botPrefix,
        MONGO_DB: mongodb,
        MAIN_OWNER: mainOwner,
      },
    },
    function (err, apps) {
      if (err) {
        console.error(err);
        return processManager.disconnect();
      } else {
        console.log(`${botName} is Running!`);
      }
    }
  );
});
