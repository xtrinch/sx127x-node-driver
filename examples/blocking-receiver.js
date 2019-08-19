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

async function receiveSingle() {
	try {
		await sx127x.open();
	} catch(err) {
		console.log(err)
	}

	while(true) {
		try {
			let packetLength = await sx127x.receiveSingle();
			if (packetLength > 0) {
				console.log("plen:" + packetLength);

				let incoming = "";

				while (await sx127x.available()) {
					incoming += String.fromCharCode(await sx127x.read());
				}

				console.log("incoming: " + incoming.toString());
			}

		} catch (err) {
			console.log(err);
		}

		await util.promisify(setTimeout)(200);
	}
}

receiveSingle();

process.on('SIGINT', function() {
  // close the device
  sx127x.close(function(err) {
    console.log('close', err ? err : 'success');
    process.exit();
  });
});