var sys = require('sys');
var exec = require('child_process').exec;
var express = require('express');
var util = require('util');
var app = express();

var settings = {
	sound: {
		soundcard: '0',
		mixerControl: 'Headphone'
	},
	http: {
		port: 3000
	}

};

var errors = {
	MALFORMED_VOLUME_DATA: {
		error: 450,
		errorMsg: 'Malformed volume data'
	},
	INTERNAL_SERVER_ERROR: {
		error: 550,
		errorMsg: 'Internal server error'
	},
	AMIXER_ERROR: {
		error: 551,
		errorMsg: 'Generic amixer error'	
	}
}

app.put('/volume/:vol', function (req, res) {
	var vol = parseVolume(req.params.vol);

	if (!vol) {
		res.status(400);
		res.json(errors.MALFORMED_VOLUME_DATA);
		return;
	}

	var child = exec('amixer -c ' + settings.sound.soundcard + ' -- sset ' + settings.sound.mixerControl + ' playback ' + vol, function (error, stdout, stderr) {
		if (error || stderr) {
			res.status(500);
			res.json({
				error: errors.AMIXER_ERROR.error,
				errorMsg: error ? error : stderr.toString('utf-8')
			});
		} else if (stdout) {
			res.json({
				volume: vol,
				message: stdout.toString('utf-8')
			});
		}
	});
});

app.get('/', function (req, res) {
	res.json({
		message: "It's all good!"
	});
});

app.use(function(err, req, res, next) {
	res
		.status(500)
		.json(errors.INTERNAL_SERVER_ERROR);
});


var server = app.listen(settings.http.port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

function parseVolume(volume) {
	var percentage = (volume.substr(-1) === 'p') ? '%' : '';
	var direction = '';
	direction = (volume.substr(0, 1) === '+') ? '+' : direction;
	direction = (volume.substr(0, 1) === '-') ? '-' : direction;
	volume = volume.replace(/[\D]/g, '');

	if (isNumber(volume)) {
		return volume + percentage + direction;
	} else {
		return false;
	}
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

