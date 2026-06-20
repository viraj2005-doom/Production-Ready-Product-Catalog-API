const app = require("./app");
const config = require("./config");

app.listen(config.port, () => {
  console.log(
    `${config.appName} running on port ${config.port}`
  );
});