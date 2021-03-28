const mihome = require("node-mihome");
const prompt = require('prompt-async');

const properties = [ { name: 'username' }, { name: 'password', hidden: true } ];

function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (input) => resolve(input) );
    });
}

const run = async function() {
  prompt.start();
  const {username, password} = await prompt.get(properties);

  const devices = await getDevices(username, password);
  console.log(devices);
  
  console.log("bye");
};


const getDevices = async (user, pass) => {
  if (mihome.miCloudProtocol.isLoggedIn) {
    await mihome.miCloudProtocol.logout();
  }
  await mihome.miCloudProtocol.login(user, pass);
  const regions = ["ru", "us", "tw", "sg", "cn", "de"];
  const allDevices = [];
  for (let index = 0; index < regions.length; index++) {
    const country = regions[index];
    const options = { country };
    const devices = await mihome.miCloudProtocol.getDevices(null, options);
    const devicesWithRegion = [];
    for (let j = 0; j < devices.length; j++) {
      const device = devices[j];
      device["region"] = country;
      devicesWithRegion.push(device);
    }
    allDevices.push(...devicesWithRegion);
  }

  return allDevices;
}

run();
