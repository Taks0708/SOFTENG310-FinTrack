# SOFTENG310-FinTrack
Financial Tracker for SOFTENG 310 Project in the University of Auckland by Team Meow Meow Kitty Cats (Group 6). This project will allows users to input and track their income and expenses for a certain period of time. Other functionality such as displaying financial metrics, currency conversion, and more will also be added.

The project is a web app that uses React.js and Tailwind for the frontend, and Express.js for the backend. The database used is PostgreSQL.

To run the web app locally, make sure to run the frontend and backend in separate terminals. If you come across errors with logging in, the backend probably isn't running.

You can contact UPI `yois920` with an email or message Discord username `Taks7`. Please only contact us if you are absolutely stuck with the set up after the project is handed off.

# General Setup
To start off, you will need the node package manager (npm) to be installed in order to download the dependencies required for the frontend and backend. npm is installed alongside node.js

You can download node.js at: https://nodejs.org/en/download/prebuilt-installer

You can check if npm is installed by typing the following into a terminal:

`npm -v`

You might have to close and reopen your IDE for it to recognise that npm has been installed

After that go into the local directory `.../SOFTENG310-FinTrack` after cloning the repository

You will need to install the dependencies for the frontend and the backend seperately using npm.

# Frontend
Make sure you're currently in the `.../SOFTENG310-FinTrack` directory (you may need to create a new terminal).
Change your current directory to the frontend using:

`cd frontend`

Then, type in the following to download all the frontend dependencies (you have to repeat this if new dependencies are added):

`npm install`

It might take a bit of time for everything to be downloaded, but once its over, you can start running the frontend!

The following section goes into great detail about the various commands, but to get started, just type the following into the terminal to run the frontend (make sure you've already entered the frontend directory):

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
Make sure you're currently in the `.../SOFTENG310-FinTrack` directory by entering into the terminal (make sure this is a different terminal than the frontend one):

`cd backend`

Then, type in the following to download all the backend dependencies (you have to repeat this if new dependencies are added):

`npm install`

It might take a bit of time for everything to be downloaded, but once its over, you can start running the backend!

To get started, just type the following into the terminal to run the backend (make sure you've already entered the backend directory):

`npm start`

## Express and Axios
To learn more about Express, check out the [Express documentation](https://expressjs.com/en/4x/api.html).

We send requests to the backend using Axios. To learn more about how to use Axios, chec out the [Axios documentation](https://axios-http.com/docs/intro)

To learn more about the endpoints that are available or how to add new endpoints, check out [the wiki](https://github.com/Taks0708/SOFTENG310-FinTrack/wiki/Endpoints)

## Database and .env File
We are using a free PostgreSQL database hosted by Aiven to store user and transaction data. In order to access the database, a .env file is required. The .env file should include fields called:

- PG_USER
- PG_HOST
- PG_DATABASE
- PG_PASSWORD
- PG_PORT
- CA_CERT_PATH:../certs/ca.crt
- CIPHER
- REACT_APP_GEMINI_API_KEY

Please contact us in order to get this .env file, as it isn't pushed to GitHub. You may need to create your own PostgreSQL database on Aiven for personal security reasons though. 

Just follow the instructions on [this page](https://aiven.io/mysql) to do so. Once you have the database created, just fill in the .env file fields shown above with your database's info. The CIPHER field can be any string you want as it is used to encrypt tokens.

For the REACT_APP_GEMINI_API_KEY, this can be created on [this page](https://aistudio.google.com/app/apikey). 

Once you have the .env file, simply place it in the **backend** folder. The database should automatically start working once this is done (regardless of whose database you're using)

If there are errors, ensure that the fields are properly filled out. Also note that the CA_CERT_PATH is prefilled out, so make sure to put your certificate from Aizen in the file: `backend/src/certs/ca.crt`.

## Testing

The backend has some unit tests for the controller classes to ensure that the functions registered to each endpoint works. In order to run these tests, go to the **backend directory** and enter:

`npm start`

The coverage of these tests can be seen by entering the following when in the backend directory:

`npm run coverage`

Do note that this will generate some folders in the backend directory. These folders have already been added to the .gitignore, and shouldn't be pushed to the main repository.

If the tests fail, make sure that all backend dependencies have been installed. If, for some reason, they aren't being installed by an `npm install`, enter `npm install --save-dev mocha chai sinon nyc` .

# Libraries/APIs
This section introduces different libraries/APIs used for the app and why they are used. This also includes links to more detailed documentation for each libraries/APIs.
## Recharts
Recharts is used for graphical representation of transaction history.
Documentation and different API that can be used from Recharts can be found on [Recharts documentation](https://recharts.org/en-US/).
## Gemini API
Gemini is used for getting financial advice for our users. 
Documentation can be found on [Gemini API documentation](https://ai.google.dev/api?lang=node).