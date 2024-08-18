# SOFTENG310-FinTrack
Financial Tracker for SOFTENG 310 Project in the University of Auckland by Team Meow Meow Kitty Cats (Group 6). This project will allows users to input and track their income and expenses for a certain period of time. Other functionality such as displaying financial metrics, currency conversion, and more will also be added.

The project is a web app that uses React.js and Tailwind for the frontend, and Express.js for the backend. The database used is PostgreSQL.

To run the web app locally, make sure to run the frontend and backend in separate terminals. If you come across errors with logging in, the backend probably isn't running.

# General Setup
To start off, you will need the node package manager (npm) to be installed in order to download the dependencies required for the frontend and backend. npm is installed alongside node.js

You can download node.js at: https://nodejs.org/en/download/prebuilt-installer

You can check if npm is installed by typing the following into a terminal
`npm -v`

You might have to close and reopen your IDE for it to recognise that npm has been installed

After that go into the local directory `.../SOFTENG310-FinTrack` after cloning the repository

You will need to install the dependencies for the frontend and the backend seperately using npm.

# Frontend
Make sure you're currently in the `.../SOFTENG310-FinTrack` directory (you may need to create a new terminal).
Change your current directory to the frontend using:
`cd frontend`

Then, type in the following to download all the frontend dependencies (you may have to repeat this if new dependencies are added):
`npm install`

It might take a bit of time for everything to be downloaded, but once its over, you can start running the frontend!

The following section goes into great detail about the various commands, but to get started, just type the following into the terminal to run the frontend:
`npm start`

## Getting Started with Create React App

The frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the frontend directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Backend
Make sure you're currently in the `.../SOFTENG310-FinTrack` directory (you may need to create a new terminal).
`cd backend`

Then, type in the following to download all the frontend dependencies (you may have to repeat this if new dependencies are added):
`npm install`

It might take a bit of time for everything to be downloaded, but once its over, you can start running the backend!

The following section goes into great detail about the various commands, but to get started, just type the following into the terminal to run the backend:
`npm start`

## Express
To learn more about Express, check out the [express documentation](https://expressjs.com/en/4x/api.html).

To learn more about the endpoints that are available, check out the wiki!

## Database
We are using an SQL database to store user and transaction data. In order to access the database, a .env file is required. The .env file should include fields called:

- PG_USER
- PG_HOST
- PG_DATABASE
- PG_PASSWORD
- PG_PORT
- CA_CERT_PATH

Please contact us in order to get this .env file, as it isn't pushed to GitHub. 

Once you have the .env file, simply place it in the backend folder.