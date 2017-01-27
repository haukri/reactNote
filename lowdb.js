const low = require('lowdb');
const db = low('db.json');

var exports = module.exports = {};

db.defaults(

	{ cards: [], layout: {}}

).value();

function saveLayout(layout) {
	db.set('layout.layout', layout)
	.value();
}

function getLayout() {
	return db.get('layout.layout').value()
}

function saveCard(value) {
	var key = getRandomID();
	db.get('cards')
		.push({ key: key, value: value})
		.value()
	return key;
}

function updateCard(key, value) {
	if(getCard(key)) {
		db.get('cards')
			.find({ key: key })
			.assign({ value: value})
			.value()
	}
}

function deleteCard(key) {
	if(getCard(key)) {
		db.get('cards')
			.remove({key: key})
			.value()
	}
}

function getCards() {
	const pos = db.get('cards')
		.value()
	if(typeof pos !== "undefined") {
		return pos
	}
	return null;
}

function getCard(key) {
	const pos = db.get('cards')
  		.find({ key: key })
  		.value()
  	if(typeof pos !== "undefined") {
  		return pos.value
  	}
  	return null;
}

function getRandomID() {

	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return "ID" + year + month + day + hour + min + sec + random(0,10000);

}

function random(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

exports.saveCard = saveCard;
exports.getCard = getCard;
exports.saveLayout = saveLayout;
exports.getLayout = getLayout;
exports.getCards = getCards;
exports.updateCard = updateCard;
exports.deleteCard = deleteCard;