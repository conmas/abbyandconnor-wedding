var dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const API_KEY = process.env.MAILGUN_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Abby and Connor are getting married.' });
});
router.get('/details', function(req, res, next) {
    res.render('details', { title: 'Details' });
});
router.get('/registry', function(req, res, next) {
    res.render('registry', { title: 'Registry' });
});
router.get('/rsvp', function(req, res, next) {
    res.render('rsvp', { title: 'RSVP' });
});
router.get('/details/ace-hotel', function(req, res, next) {
    res.render('ace-hotel', { title: 'Ace Hotel' });
});
router.get('/details/kaiser-tiger', function(req, res, next) {
    res.render('kaiser-tiger', { title: 'Kaiser Tiger' });
});
router.get('/details/little-goat', function(req, res, next) {
    res.render('little-goat', { title: 'Little Goat' });
});

router.post('/rsvp-submit', [
	check('name', 'Please enter your name.').isLength({min:1}).trim()
	], function(req, res, next) {

		// deal with errors from the form validation
		const errors = validationResult(req);
  		if (!errors.isEmpty()) {
    		return res.status(422).json({ errors: errors.array() });
  		}

  		// if no validation errors, then create the email
		let data = {
			from: 'rsvp@abbyandconnor.wedding',
			to: process.env.MAILGUN_TO_ADDRESS,
			subject: 'New RSVP from ' + req.body.name,
			text: req.body.name + ' has RSVPed to your wedding! \n\n' + 'Attending wedding at Little Goat? ' + req.body.wedding + '\n Attending welcome reception at Kaiser Tiger? ' + req.body.kaiser + '\n Notes: ' + req.body.message
		};

		//send the email
		mailgun.messages().send(data, (error, body) => {
			if(error) {
				console.log(error);
				res.redirect('/error');
			} else {
				console.log('An email from ' + req.body.name + ' was sent to ' + process.env.MAILGUN_TO_ADDRESS);
				res.redirect('/thanks');
			}
		});

});

router.get('/thanks', function(req, res, next) {
	res.render('thanks');
})


module.exports = router;
