const express = require('express');
const app = express();
const util = require('util');
const {
  exec
} = require('child_process');
var SX127x = require('../lib/sx127x');
var sx127x = new SX127x({
  frequency: 434e6,
  dio0Pin: 6, // BCM numbering (run `gpio readall` for info)
  resetPin: 13, // BCM numbering (run `gpio readall` for info)
  syncWord: 0x12,
  debug: true,
  tempCompensationFactor: 10,
});

async function receiveContinuous() {
	try {
		await sx127x.open();
		await sx127x.setContinuousReceiveMode();
	} catch(err) {
		console.log(err)
	}

	sx127x.on('data', function(data, rssi, snr) {
		console.log('data: ' +  data.toString() + ", rssi: " + rssi);
	});

	while(true) {
		await util.promisify(setTimeout)(1000);
	}
}

receiveContinuous();

process.on('SIGINT', async function() {
  // close the device
  try {
	  await sx127x.close();
  } catch (err) {
  	console.log('close failure: ' + err);
  	process.exit();
  }

  console.log("success");
  process.exit();
});