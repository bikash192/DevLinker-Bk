# DevLinker APIs
## /authRouter
- POST /signup
- POST /login
- POST /logout

## /profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password  //forgot pasword api

## /connectionRequestRouter
- POST /request/send/intersted/:useId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POSt /request/review/rejected/:requestedId

## /userRouter
- GET user/connections
- GET /requests/received
- GET /feed- Gets you the profile of others users on platform
-  


Status:ignore,interersted,accepted,rejected