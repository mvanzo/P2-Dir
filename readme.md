# daySpark
* Description: Bored and looking for something to do today? Log in to daySpark and use our spark generator to toss some ideas your way! Results can fine-tuned to type of activity and the number of people involved. If you see an activity that sparks your interest, add it to your list! There you can make and read comments made by other users on their experience with this activity.

## API
* https://www.boredapi.com/

## ERD

![an ERD of my project](./ERD.drawio.png)

## RESTful Routing
Layout:
|         Path   |   HTTP Verb   |    Purpose     |
|:--------------:|:-------------:|:-----------------------------------------------------|
|     /            |   GET   | Home page: description of app, log in/sign up, random activity generator button |
|   /users/new     |   GET   |  New user form   |
|     /users       |   POST  |  Create new user  |
|     /users       |   PUT   |  Update user info  |
| /users/profile   |   GET   |  User profile including activities list |
| /users/login     |   POST  |  Attempt user login |
| /users/logout    |   GET   |  Log out, clear cookies, redirect to home page |
| /activities      |   GET   |  List of favorites |
| /activities      |   POST  |  Add activity to list of favorites |
| /activities/:id  |   PUT   |  Update completed activity |
| /activities/:id  |  DELETE |  Delete from favorites list |
| /activities/:id/comments |  POST |  Add comment |
| /activities/:id/comments |  PUT  |  Edit comment |
| /activities/:id/comments | DELETE |  Delete comment |

# User Stories
* As a user, I want to open to a page with a clear description of what it does and an example without having to log in
* As as a user, I want to be able to log in and log out and have it be clear if I am signed in
* As a user, I want to be able to populate a random activity based off of number of participants, or type of activity. Re-populate from the same page, and then add to my favorites list
* As a user, I want to pick a specific activity from my list of favorites and see other users comments on it, make my own comments, and edit/delete my comments

# MVP
* Log in/out with clear visual in top navbar if logged in
* Button to populate random activity
    * Add one qualifier to query - either # of participants, or type of activity
* List of all favorited activities

# Stetch Goals
* Multiple queries for random activity - not sure if I can do this with the API
* Favorited activities sorted by type of activity or number of people

# Pitch Requirements
Pitches will be a readme in the project repo that inclues the following:
* Project idea and description
* Choice of API you are going to use and a proof of concept (API keys --hitting the api)
* ERDs
* Restful routing chart --- add a chart directly into the markdown
* Wireframes of all user views
* user stories
* MVP Goals/Stretch Goals