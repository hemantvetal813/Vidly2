const config = require("config");

module.exports = function() {
  // You must run your file with the same CLI program (and instance) you used to set the variable value.
  // In Command Prompt: set PORT=5000
  // In Power Shell: $env:PORT=5000
  // In Bash (Windows): export PORT=5000
  // After that, run your program node app.js and it works.

  // If you're using the integrated terminal of VSCode to run your file,
  // but using another CLI program (or instance) to set the value of PORT, is not going to work unless you
  // change that value permanently by using set PORT 5000 either with the Command Prompt or Power Shell
  //  (I don't know how to do it from Bash for Windows). In that case, you would need to restart VSCode for
  //   running your file with the last value of PORT.
  //if it still not working
  // then save env variable manually in settings and restart the pc

  //default.json is template
  if (!config.get("jwtprivatekey")) {
    throw new Error(
      "jwtprivatekey not set, in cmd: set vidly_password=something"
    );
    // process.exit(1); //1 for exit
  }
};
