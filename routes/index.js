var dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const API_KEY = process.env.MAILGUN_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Abby and Connor are getting married.' });
});

/* GET details page. */
router.get('/details', function(req, res, next) {
    res.render('details', { title: 'Details' });
});

/* GET registry page. */
router.get('/registry', function(req, res, next) {
    res.render('registry', { title: 'Registry' });
});

/* GET RSVP page. */
router.get('/rsvp', function(req, res, next) {
    res.render('rsvp', { title: 'RSVP' });
});

router.post('/', [
	check('name', 'Please enter your name.').isLength({min:1}).trim(),
	check('message', 'Please enter a message.').isLength({min:1}).trim()
	], function(req, res, next) {

		// deal with errors from the form validation
		const errors = validationResult(req);
  		if (!errors.isEmpty()) {
    		return res.status(422).json({ errors: errors.array() });
  		}

  		// if no validation errors, then create the email
		let data = {
			from: req.body.name,
			to: process.env.MAILGUN_TO_ADDRESS,
			subject: 'New RSVP from ' + req.body.name,
			text: req.body.message
		};

		//send the email
		mailgun.messages().send(data, (error, body) => {
			if(error) {
				console.log(error);
				res.redirect('/');
			} else {
				console.log('An email from ' + req.body.email + ' was sent to ' + process.env.MAILGUN_TO_ADDRESS);
				res.redirect('/thanks');
			}
		});

});

router.get('includes/thanks', function(req, res, next) {
	res.render('includes/thanks');
})


module.exports = router;
