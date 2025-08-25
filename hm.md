--Create a repository
--initialse the repostiory
--node_modules,pacakge.json,pacajkage-lock.json'
--Insatll expresser4
--Create a server
--Listen on port1010
--write request handlers
--install nodemon
-------------------------------------------------------------------------------------------------------

--initialse git
.gitignore
--Create a remote repomon github
--push all code to remote origin
--Play with the routes --extesnion ./helllo, / , /hello/2
--order of the code matters
--write logic to handle GET,POST,PATCH,DELETE,API call and test them on postman
--Explore routing and use of ?,+,(),* in the routes
--Use of regex in routes /a/,/.*fly$/
--Reading the query params in the routes
--Reaing the dynamic routes
--------------------------------------------------------------------------------------------------------
--create multiple routes
--next()
--next() Function with error and also with res.end()
-What is middleware
how express js bascially handle request behind the scenes
Difference app.use and app.all
Write a dummy auth middleware for admin
-write a dummy auth middleware  for all users routes ,except/user/login
--Error Handing using app.use()

--------------------------------------------------------------------------------------------------------------------
- create a free cluster on MongoDb official website(Mongo Atlas)
- Install mongoose library
- connect your application to the databse/devlinker
- call the connectDb function and connect to database before starting application on 7777
- create a userScehema & userModel
- create /signUp Api to add data to database
------------------------------------------------------------------------------------------------------------------
- difference between Javascript Object and JSON
- Add the express.json middleware to you app 
- Mae your signup Api dynamic and receive data from the end user 
- User.findOne with duplicate email ids which object returned
- API -Get user any email 
- API feed
- create delete the data form the database
------------------------------------------------------------------------------
- Expolre schema options from the documentations
- add required unique ,lowecae ,min, minlength,trips
- add default 
- create  a custom validate function form gender
- Improve the DB schema - put all appropraite validation on each field in Schema
- add timestamps to the userSchema
- Add api level vaidation on patch request and signup post api
- Add api validataion for each field 
- Explorer validator library function and use validator function for password email and phtourl
- Never trust req.body
---------------------------------------------------------------------------------
- Validate data in signUp api using helper function

- instal bcrypt package 
- create a PasswordHash using bcrypt.hash and save the user is save to the database
- create login api and compare password and throw error password and email is not valid
--------------------------------------------------------------------------------
- install cookie-parser
- send a dummy cookiew to the user
- create get /profile api and check if you get the cookie back
-  install json webtoken 
- create a login api  email and password after validation 
- read the cookiew inside your api and find the logged in user
-  create schema methods to get jwt token
- create schema methods to take password as input and return isPasswordValid
--------------------------------------------------------------------------------------------------------------------
- Explore tinder Apis
- create a list all API you can think of in Dev tinder
- Group mulitple routes under respective routes
- read documentation for express.router
- Create routes folder for managing auth profile request routers
- create authRouter, profileRouter,requestRouter
- import these routers in app
--------------------------------------------------------------------------------------------------------------------
- Create a coonection request Schemea and add more validation
- Read more index in MongoDb
--------------------------------------------------------------------------------------------------------------------

- write vaidation for accepted and rejected
- Thought process - post vs get
- read about ref and populate
- Create Get/user/request/reveived


# Razorpay Payment Gateway Integration

- Sign up on Razorpay and get kyc
- create ui for payment page 
- now create backend for this
- Inialise razorpay in utils,
- env file
- Created order on razorpay
- Created a Schema and model
- save the oredr in payment collection