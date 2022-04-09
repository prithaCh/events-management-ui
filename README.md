# events-management-ui

Events Management web interface

## Pre-requisite

This application consumes REST API exposed by the backend micro-services:

- User profile service (for user registration)
- Events management service (to manage events)
- Events booking service (to manage event booking by users)
- User feedback service (to capture user feedback on events)

*Note:*
 a. Current version of the UI needs user profile to be created on the backend (use 'user profile' API exposed from the backend.
 b. Default password is set to 'booker'. Login verification is in-progress, will be integrated shortly.
 c. User feedback screen is not currently integrated into the module, related functionality can be tested via backend APIs exposed

## To run the application

1. Clone the git repository
`git clone <https/ssh>:raghavendrarao4/events-management-ui.git`
2. Install npm packages - axios, ejs, body-parser, express with the command `npm install` *(packages already included in `package.json`)*
3. `nodemon` package is optional for development
4. Run `node index.js` from command prompt
5. View application endpoint at http://localhost:3000

## Build docker image and run locally

1. Run `docker build . -t <user-name>/events-management-ui`

2. Run `docker run -p 3000:3000 -d <user-name>/events-management-ui`

3. Verify the application on http://localhost:3000/

Note: Replace `<user-name>` with your desired value.

---

## Run booking-service docker container from DockerHub

1. Start your docker server (docker desktop or minikube)
2. Pull the booking-service docker image from [DockerHub](https://hub.docker.com/repository/docker/pranab698/events-management-service/tags?page=1&ordering=last_updated) \
`docker pull pranab698/events-management-ui:v0.1.0`

3. Run \
`docker run -p 3000:3000 -d pranab698/events-management-ui:v0.1.0`

4. Verify the application on http://localhost:3000/


## Tech stack

Express, Mongo DB, EJS, Axios

## TO DO

App is verified locally, yet to be deployed & tested on cloud environment