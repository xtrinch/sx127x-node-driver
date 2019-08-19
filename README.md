# sx127x-node-driver

Based on [node-sx127x](https://github.com/xtrinch/node-sx127x). Node.js driver for [Semtech SX1276/77/78/79](http://www.semtech.com/apps/product.php?pn=SX1276) based LoRa radios.

Requires a **Linux** computer with SPI hardware, like a Raspberry Pi.

Built on top of [@fivdi](https://github.com/fivdi)'s [onoff](https://github.com/fivdi/onoff) and [spi-device](https://github.com/fivdi/spi-device) modules.

## Prerequisites

 * Linux computer with SPI hardware
 * Node.js installed
 * SPI driver installed and enabled
   * uncomment `dtparam=spi=on` in `/boot/config.txt`

# Hardware Wiring

| Semtech SX1276/77/78/79 | Generic Linux | Raspberry Pi |
| :---------------------: | :-----------: | :----------: |
| VCC | 3.3V | 3.3V |
| GND | GND | GND |
| SCK | SCK | SCK (pin 11) |
| MISO | MISO | MISO (pin 10) |
| MOSI | MOSI | MOSI (pin 9) |
| NSS | Chip enable/select | CS0 (pin 8) or CS1 (pin 7) |
| NRESET | GPIO pin | GPIO pin |
| DIO0 | GPIO pin | GPIO pin |

## Installation

```sh
npm install sx127x-node-driver
```

## API

### Import Library

```js
var SX127x = require('sx127x');
```

### Create device

```js
var options = {
  // ...
};

var sx127x = new SX127x(options);
```

Supported options:

| Name | Default | Description |
|------|---------|-------------|
| `spiBus` | `0` | SPI bus to use |
| `spiDevice` | `0` | SPI chip select/enable to use |
| `resetPin` | `24` | GPIO pin number of reset pin |
| `dio0Pin` | `25` | GPIO pin number of DIO0 pin |
| `frequency` | `915e6` | Frequency of radio in Hz, see [setFrequency](#frequency) for supported values |
| `spreadingFactor` | `7` | Spreading factor of radio, see [setSpreadingFactor](#spreading-factor) for supported values  |
| `signalBandwidth` | `125E3` | Signal bandwidth of radio in Hz, see [setSignalBandwidth](#signal-bandwidth) for supported values  |
| `codingRate` | `4 / 5` | Coding rate of radio, see [setCodingRate](#coding-rate) for supported values |
| `preambleLength` | `8` | Preamble length of radio, see [setPreambleLength](#preamble-length) for supported values |
| `syncWord` | `0x12` | Sync word of radio, see [setSyncWord](#sync-word) for supported values |
| `txPower` | `17` | TX power of radio, see [setTxPower](#tx-power) for supported values |
| `crc` | `false` | Enable or disable CRC usage |
| `tempCompensationFactor` | `false` | compensation factor for temperature measurements in degrees celsius (+- some degrees)
| `debug` | `false` | enable / disable debug output


### Open

Open and configure the device:

```js
try {
  await sx127x.open();
} catch(err) {
  console.log(err)
}
```

### Close

Close the device:

```js
try {
  await sx127x.close();
} catch (err) {
  console.log('close failure: ' + err);
  process.exit();
}
});```

### Sending data

```js
try {
  await sx127x.write(new Buffer('hello ' + count++));
  console.log("successfully sent")
} catch (err) {
  console.log(err);
} 
```

### Blocking receive

```js
try {
  let packetLength = await sx127x.receiveSingle();
  if (packetLength > 0) {
    let incoming = "";

    while (await sx127x.available()) {
      incoming += String.fromCharCode(await sx127x.read());
    }
  }
} catch (err) {
  console.log(err);
}
```

### Sleep mode

Put the radio in sleep mode.

```js
try {
  await sx127x.sleep();
} catch (err) {
  console.log(err);
}
```

### Idle mode

Put the radio in idle mode.

```js
try {
  await sx127x.standBy();
} catch (err) {
  console.log(err);
}
```

## Radio parameters

### TX Power

Change the TX power of the radio.

```js
try {
  await sx127x.setTxPower(txPower);
} catch (err) {
  console.log(err);
}
```
 * `txPower` - TX power in dB, defaults to `17`

 Supported values are between `2` and `17`.

### Frequency

Change the frequency of the radio.

```js
try {
  await sx127x.setFrequency(frequency);
} catch (err) {
  console.log(err);
}
```
 * `frequency` - frequency in Hz (`433E6`, `866E6`, `915E6`)

### Spreading Factor

Change the spreading factor of the radio.

```js
try {
  await sx127x.setSpreadingFactor(spreadingFactor);
} catch (err) {
  console.log(err);
}
```
 * `spreadingFactor` - spreading factor, defaults to `7`

Supported values are between `6` and `12`. If a spreading factor of `6` is set, implicit header mode must be used to transmit and receive packets.

### Signal Bandwidth

Change the signal bandwidth of the radio.

```js
try {
  await sx127x.setSignalBandwidth(signalBandwidth);
} catch (err) {
  console.log(err);
}
```

 * `signalBandwidth` - signal bandwidth in Hz, defaults to `125E3`.

Supported values are `7.8E3`, `10.4E3`, `15.6E3`, `20.8E3`, `31.25E3`, `41.7E3`, `62.5E3`, `125E3`, and `250E3`.

### Coding Rate

Change the coding rate of the radio.

```js
try {
  await sx127x.setCodingRate(codingRate);
} catch (err) {
  console.log(err);
}
```

 * `codingRate` - coding rate, defaults to `4/5`

Supported values are `4/5`, `4/6`, `4/7` and `4/8`.

### Preamble Length

Change the preamble length of the radio.

```js
try {
  await sx127x.setPreambleLength(preambleLength);
} catch (err) {
  console.log(err);
}
```

 * `preambleLength` - preamble length in symbols, defaults to `8`

Supported values are between `6` and `65535`.

### Sync Word

Change the sync word of the radio.

```js
try {
  await sx127x.setSyncWord(syncWord);
} catch (err) {
  console.log(err);
}
```

 * `syncWord` - byte value to use as the sync word, defaults to `0x34`

### CRC

Enable or disable CRC usage, by default a CRC is not used.

```js
try {
  await sx127x.setCrc(crc);
} catch (err) {
  console.log(err);
}
```

 * `crc` - `true` to enable CRC, `false` to disable

## Other functions

### Random

Generate a random byte, based on the Wideband RSSI measurement.

```js
try {
  let random = await sx127x.readRandom(crc);
} catch (err) {
  console.log(err);
}
```

## Examples

See [examples](examples) folder.

## License

This libary is [licensed](LICENSE) under the [MIT Licence](http://en.wikipedia.org/wiki/MIT_License).
