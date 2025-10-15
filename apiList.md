Yc DevTinter apis

## authRouter
-POST /auth/register
- POST/auth/login
-POST/auth/logout 

## profileRouter
-GET /profile/view
-PATCH/profile/edit
-PATCH/ profile/password- forgot password

## connectionRequestRouter
<!-- -POST/request/send/interested/:userId
-POST/request/send/ignored/:userId -->

=>-POST/request/send/:status/:userId


<!-- -POST/request/review/accepted/:requestedId
-POST/request/review/rejected/:requestId -->
=>POST/request/review/:status/:requestId 

## userRouter
-GET/user/connections
-GET/user/requests/accepted
-GET/user/feed - Gets you the profile of other users on platform
