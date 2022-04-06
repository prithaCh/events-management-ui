const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./config/config.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

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
		res.redirect("/view");
	} else {
		res.render("failure");
	}
});

//Update or delete event
app.post("/update-event", (req, res) => {

	let updateClick = req.body.update;
	let deleteClick = req.body.delete;
	let id = req.body.eventId;

	var eventmgmtURL = config.eventMgmtBaseURL + 'event/' + id;
	
	try {
		if(updateClick) {
			let payload = { eventName: req.body.eventName, eventType: req.body.eventType, 
				description: req.body.description, place: req.body.place, 
				capacity: req.body.capacity, eventDate: req.body.eventDate };
			
			let response = axios.put(eventmgmtURL, payload);
		}
		
		if(deleteClick) {
			let response = axios.delete(eventmgmtURL);
		}
		
		res.redirect("/view");
	} catch (error) {
		console.log(error);
		res.status(400).send("Error during event update / delete");
	}
});

//Add an event
app.post("/add", (req, res) => {
	
	var eventmgmtURL = config.eventMgmtBaseURL + 'event';
	
	let payload = { eventName: req.body.eventName, eventType: req.body.eventType, 
					description: req.body.description, place: req.body.place, 
					capacity: parseInt(req.body.capacity), eventDate: req.body.eventDate };

	try {
		
		let response = axios.post(eventmgmtURL, payload);
		res.redirect("/view");
		
	} catch (error) {
		console.log(error);
		res.status(400).send("Error while adding an event");
	}
	
});


// Display all events
app.get("/view", async (req, res) => {
	
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
	
app.listen(3000, () => {
  console.log("server started on port 3000");
});