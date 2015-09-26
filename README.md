#homeauto-node-pi-speaker

**Work in progress**

This Node script is intended to run on a Raspberry Pi (or other Linux box) which acts as an audio source (e.g. running [Mopidy](https://www.mopidy.com/) or [Shairport-Sync](https://github.com/mikebrady/shairport-sync)).

It spinns up a http server to which you can make http calls and interact with the Raspberry.

## Installation

```
git clone https://github.com/emiloberg/homeauto-node-pi-speaker.git
npm install
```

Edit the `settings` object in `index.js` to match your soundcard. Run `amixer` in your terminal to get the soundcard hardware number and mixer control name.

Example, soundcard hardware number is `0` and mixer control name is `Headphone`:

```
$ amixer
Simple mixer control 'Headphone',0
  Capabilities: pvolume pswitch pswitch-joined penum
  Playback channels: Front Left - Front Right
  Limits: Playback 0 - 151
  Mono:
  Front Left: Playback 8 [5%] [-26.88dB] [on]
  Front Right: Playback 8 [5%] [-26.88dB] [on]
```
  



## Functionality
Currently, there's only one function - setting the audio out volume of your Raspberry (or other Linux box).
### Set audio output volume 
Uses the mixer for the ALSA soundcard driver to set the output volume. 


##### HTTP endpoints:

```
PUT: /volume
```

##### Parameters: 
Best described with examples:

```
50p  // Sets volume to 50%
2p   // Sets volume to 2%
+10p // Increase volume by 10%
```

##### Responses:
Normal HTTP Response codes.

* 200 - All good
* 400 - Malformed volume data. 
* 500 - Internal server error. E.g. `amixer` responsed with some kind of error.

Will respond with a JSON with a `message` property if successful (HTTP Code 200) and a `errorMsg` if something's wrong (HTTP Code >= 300).

#####Example:

```
192.168.1.50:3000/volume/+20p
```