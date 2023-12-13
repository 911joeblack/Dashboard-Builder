# Dashboard Builder
The Custom Dashboard Builder is a web-based application that allows users to create their own custom dashboards for displaying, visualizing, and analyzing data from supported APIs or user-uploaded datasets. The goal is to provide a general-purpose tool that can be used by individuals and businesses alike to display information relevant to their interests or operations. The project will involve requirements engineering, architecture and design, user experience (UX) design, and the implementation of best practices and coding standards.
## Installation/Setup
Clone the repo using the command 
git clone github.com/911joeblack/Dashboard-Builder
Install dependencies by navigating to the project directory, keep in mind you must do this twice, once in the dashboard-app folder and another in the backend folder
cd backend
npm install
cd ../dashboard-app
npm install
Database setup
Install mySQL
First install mySQL and create a database, I named my name dashboarddb, I recommend naming your database the same to prevent an issue occurring from the environment vars. Then install mySQL shell for vscode and create a connection to the database. (mysql.com)

Then modify the connection in the .env, you must also configure jwt to work on your local machine by generating a jwt token and attaching a public key which can be set to your choosing. Once you generate your jwt token you can change JWT_SECRET in the .env file to be equal to your public key. Also check that DB_NAME will be equal to the database name if you chose a different database name.

Then execute the sql scripts in the provided file dashboarddbimport.sql against said database. 
Run the application
Navigate to the backend folder and start the server via npm start
Navigate to the dashboard-app folder and start the server via npm start
This will then automatically open the project in your web browser, ensure that you have two terminals open with one running the backend and the other the front end as the servers are two entirely separate programs.


### Author
- [Joel Perez]

