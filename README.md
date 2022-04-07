# events-management-ui
Events Management web interface

# Pre-requisite
This application consumes REST API exposed by the backend micro-services:
	- User profile service (for user registration)
	- Events management service (to manage events)
	- Events booking service (to manage event booking by users)
	- User feeback service (to capture user feedback on events)

Note: 
 a. Current version of the UI needs user profile to be created on the backend (use 'user profile' API exposed from the backend.
 b. Default password is set to 'booker'. Login verification is in-progress, will be integrated shortly.
 c. User feedback screen is not currently integrated into the module, related functionality can be tested via backend APIs exposed

# To run the application
1. Clone the git repository
2. Install npm packages - axios, ejs, body-parser, express with the command `npm install` (packages already included in package.json) 
3. 'nodemon' package is optional for development
4. Run 'node index.js' from command prompt
5. View application endpoint at localhost:3000

# Tech stack
Express, Mongo DB, EJS, Axios

# TO DO
App is verified locally, yet to be deployed & tested on cloud environment