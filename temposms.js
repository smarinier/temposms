#!/usr/bin/env node
const yargs =  require('yargs');
const strftime = require('strftime');
const convict = require('convict');
const toml = require('toml');
const axios = require('axios');

// our .conf is using TOML format
convict.addParser({ extension: 'conf', parse: toml.parse });

// globals
const URL = {
	EDFTempoStatus : 'https://particulier.edf.fr/services/rest/referentiel/searchTempoStore?dateRelevant=', // %Y-%m-%d
	FreeSMSAPI : 'https://smsapi.free-mobile.fr/sendmsg',
	UserAgent : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1'
};


// https://mobile.free.fr/account/mes-options/notifications-sms
// sample : https://smsapi.free-mobile.fr/sendmsg?user=91065287&pass=f5VAMU49xyAciu&msg=Hello%20World%20!
async function sendMessage( content) {

	if (options.print) {
		console.log(content);
		return;
	}

	axios({
		url: URL.FreeSMSAPI,
		method: 'post',
		headers: {
				'User-Agent': URL.UserAgent
		},
		data: {
			user : config.get('user'),
			pass : config.get('pass'),
			msg: content
		}
	})
	.then(function( response) {
		console.log(response.status);
	}).catch( (error => {
		console.log(error);
	}));
}

async function informUser( dayStatus) {

	if (dayStatus.error) {
		await sendMessage('Erreur :'+dayStatus.error);
		return;
	}
	var content = "Aujourd'hui:"+dayStatus.couleurJourJ+"\nDemain:"+dayStatus.couleurJourJ1;
	await sendMessage(content);
}

async function GetEDF(today) {

	const url = URL.EDFTempoStatus+today;
	try {
		const response = await axios.get(url);
		var dayStatus = response.data;
		informUser(dayStatus);
	} catch (error) {
		const err = error.message;
		informUser({error: error.message});
	}
}

function main() {
	const now = new Date();
	const today = strftime('%Y-%m-%d', now);

	// informUser(JSON.parse('{"couleurJourJ":"TEMPO_BLEU","couleurJourJ1":"TEMPO_BLEU"}'));
	// return;
	GetEDF(today);
}

// -----------------------------------
// start 
// -----------------------------------

const options = yargs
.usage('Usage $0 [options]\nSend SMS with EDF Tempo Status')
.options('v', {alias:'verbose'})
.options('p', {alias:'print', description: 'Just print on screen Tempo Status'})
.help('h')
.alias('V', 'version')
.strictOptions(true)
.argv;

const config = convict({
	user:'me',
	pass:''
}).loadFile('free.conf');
main();
