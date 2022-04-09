const express = require("express");
var session = require('express-session')
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./config/config.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'something', resave: false, saveUninitialized: true }))

//default route
app.get("/", (req, res) => {
  res.render("index"); // index refers to index.ejs
});

//Post to login
app.post("/login", async (req, res) => {	
	var email = req.body.email;
	var credentials = req.body.pwd;

	var userprofileURL = config.userProfileBaseURL + 'userprofile?email=';
	let result = await axios.get(userprofileURL + email);
	
	if(credentials == "booker" && result.data != "") {
		req.session.email = email;
		res.redirect("/view-events");
	} else {
		res.render("failure");
	}
});

// Display all events
app.get("/view-events", async (req, res) => {
	
	try {
		var eventmgmtURL = config.eventMgmtBaseURL + 'events';
		const events = await axios.get(eventmgmtURL);
		
		const eventlist = events.data.map((events) => ({
			id: events.id,
			eventName: events.eventName,
			eventType: events.eventType,
			description: events.description,
			place: events.place,
			capacity: events.capacity,
			eventDate: events.eventDate
		}));
		
		res.render("eventslist", {eventlist});
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error while getting list of events");
	}
});

//Update or delete event
app.post("/update-event", (req, res) => {

	let updateClick = req.body.update;
	let deleteClick = req.body.delete;
	let bookClick = req.body.book;
	let feedbackClick = req.body.feedback;
	let id = req.body.eventId;

	var eventmgmtURL = config.eventMgmtBaseURL + 'event/' + id;
	
	try {
		if(updateClick) {
			let payload = { eventName: req.body.eventName, eventType: req.body.eventType, 
				description: req.body.description, place: req.body.place, 
				capacity: req.body.capacity, eventDate: req.body.eventDate };
			
			let response = axios.put(eventmgmtURL, payload);
			res.redirect("/view-events");
		}
		
		if(deleteClick) {
			let response = axios.delete(eventmgmtURL);
			res.redirect("/view-events");
		}
		
		if(bookClick) {
			req.session.eventName = req.body.eventName;
			res.redirect("/view-bookings");
		}
		
		if(feedbackClick) {
			req.session.eventName = req.body.eventName;
			res.redirect("/view-feedback");
		}
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error during event update / delete");
	}
});

//Add an event
app.post("/add-event", (req, res) => {
	
	let addClick = req.body.addevent;
	let logout = req.body.logout;

	var eventmgmtURL = config.eventMgmtBaseURL + 'event';
	
	if(addClick) {
		let payload = { eventName: req.body.eventName, eventType: req.body.eventType, 
						description: req.body.description, place: req.body.place, 
						capacity: parseInt(req.body.capacity), eventDate: req.body.eventDate };

		try {
			let response = axios.post(eventmgmtURL, payload);
			res.redirect("/view-events");
		} catch (error) {
			console.log(error);
			res.status(400).send("Error while adding an event");
		}
	}
	
	if(logout) {
		req.session.email = '';
		res.redirect("/");
	}
	
});


// Display bookings for an event
app.get("/view-bookings", async (req, res) => {
	
	try {
		
		var eventBookingURL = config.eventBookingBaseURL + 'bookingbyevent?eventName=' + encodeURI(req.session.eventName);
		
		const bookings = await axios.get(eventBookingURL);
		
		const bookingslist = bookings.data.map((bookings) => ({
			id: bookings.id,
			eventName: bookings.eventName,
			email: bookings.email,
			quantity: bookings.quantity,
			bookingDate: bookings.bookingDate
		}));
		
		var eventName = req.session.eventName;
		res.render("bookingslist", {bookingslist, eventName});
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error while getting list of bookings");
	}
});


//Update feedback or delete booking
app.post("/update-feedback", (req, res) => {

	let deleteClick = req.body.delete;
	let bookingId = req.body.bookingId;

	var eventBookingURL = config.eventBookingBaseURL + 'booking/' + bookingId;
	
	try {
		
		if(deleteClick) {
			let response = axios.delete(eventBookingURL);
		}

		res.redirect("/view-bookings");
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error during feedback update / booking delete");
	}
});

//Add a booking
app.post("/add-booking", (req, res) => {
	
	let addClick = req.body.add;
	let backClick = req.body.back;
	let feedbackClick = req.body.feedback;

	var eventBookingURL = config.eventBookingBaseURL + 'booking';
	var feedbackURL = config.userFeedbackBaseURL + 'feedback';
	
	try {
		
		if(backClick) {
			req.session.eventName = '';
			res.redirect("/view-events");
		}

		if (addClick) {
			let payload = { eventName: req.session.eventName, email: req.session.email, 
				quantity: parseInt(req.body.quantity) };

			let response = axios.post(eventBookingURL, payload);
			res.redirect("/view-bookings");
		}
		
		if(feedbackClick) {
			let payload = { eventName: req.session.eventName, email: req.session.email, 
				rating: req.body.rating, comments: req.body.comments };
		
			let response = axios.post(feedbackURL, payload);
			res.redirect("/view-bookings");
		}

	} catch (error) {
		console.log(error);
		res.status(400).send("Error while adding a booking");
	}
	
});

// Display user reviews for an event
app.get("/view-feedback", async (req, res) => {
	
	try {
		
		var feedbackURL = config.userFeedbackBaseURL + 'feedbackbyevent?eventName=' + encodeURI(req.session.eventName);
		
		const reviews = await axios.get(feedbackURL);
		
		const reviewslist = reviews.data.map((reviews) => ({
			id: reviews.id,
			eventName: reviews.eventName,
			email: reviews.email,
			rating: reviews.rating,
			comments: reviews.comments
		}));
		
		var eventName = req.session.eventName;
		res.render("reviews", {reviewslist, eventName});
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error while getting feedback list");
	}
});

//Return to events page
app.post("/feedback", (req, res) => {

	let backClick = req.body.back;
	
	try {
		if(backClick) {
			res.redirect("/view-events");
		}
	} catch (error) {
		console.log(error);
		res.status(400).send("Error during view user reviews");
	}
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});