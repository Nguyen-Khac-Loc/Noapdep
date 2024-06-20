# Noapdep 😋😋
This project is a Node.js application that uses MongoDB with Mongoose for database management and Pug for templating.

## Prerequisites
Before running the application, make sure you have the following installed:

- Node.js (version >= 18)
- MongoDB (version >= 6)
## Installation
Follow these steps to install the project:

Clone the repository from GitHub:
```
git clone https://github.com/Nguyen-Khac-Loc/Noapdep.git
```
Navigate into the project directory:
```
cd Noapdep
```
Install dependencies using npm or yarn:
```
npm install
```

or

```
yarn install
```

## Configuration
Create a .env file in the root directory based on .env.example.
Update the .env file with your MongoDB connection string.
Running the App
To run the application, use one of the following commands:

Using npm:
```
npm start

```
Using yarn:

```
yarn start
```
This will start the Node.js server. By default, the server runs on http://localhost:3000.

## Usage
Open your web browser and navigate to http://localhost:3000 (or the specified port).
You should see the application up and running.
## Project Structure
Here's a brief overview of the project structure:

```
Noapdep/
│
├── controllers/     # Request handlers
├── handlers/        # handler factory, sending mail logic
├── models/          # Mongoose models
├── public/          # Static files (CSS, JS, images)
├── routes/          # Route definitions
├── utils/          # some utilities
├── views/           # Pug templates
├── .env             # Environment variables
├── .env.example     # Example environment variables (rename to .env)
├── app.js           # Main application file
└── README.md        # This file
```
## Contributing
Feel free to contribute to this project. Fork it and submit a pull request!

