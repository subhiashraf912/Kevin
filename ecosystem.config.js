const mongodb =
  "mongodb+srv://root:root@maindb.uvcv2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = {
  apps: [
    {
      name: "Kevin",
      script: "./dist/src/Bot/index.js",

      env: {
        NODE_ENV: "production", // Example environment variable
        BOT_TOKEN:
          "OTMyMzYyNTg3NTUzNzkyMDYw.YeR4Uw.ZPd-oWZ5DxnvxMIwiYhN3pf192A",
        BOT_PREFIX: "!",
        MONGO_DB: mongodb,
        MAIN_OWNER: "507684120739184640",
      },
    },
    {
      name: "Venom",
      script: "./dist/src/Bot/index.js",

      env: {
        NODE_ENV: "production",
        BOT_TOKEN:
          "OTM5OTQxOTQyMDE0Mzc3OTg0.YgALJg.gm9dW23NMeFl1n7kphYKltGE-0U",
        BOT_PREFIX: "!",
        MONGO_DB: mongodb,
        MAIN_OWNER: "507684120739184640",
      },
    },
  ],
};
