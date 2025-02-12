const { exec } = require('child_process');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const timeset = 60

async function Start () {
    exec('npm uni discord.js');
    console.log('Step 1 of 4.');
    await delay((timeset*(1/4)) * 1000);
    exec('npm i discord.js@13');
    console.log('Step 2 of 4.');
    await delay((timeset*(1/4)) * 1000);
    exec('npm audit fix --force');
    console.log('Step 3 of 4.');
    await delay((timeset*(1/4)) * 1000);
    exec('npm audit fix');
    console.log('Step 4 of 4.');
    await delay((timeset*(1/4)) * 1000);
    console.log('Starting...');
    exec('node Main/index.js');
};

Start()