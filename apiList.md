
 # DevTinder API's

=> authRouter
 - POST /signup   -> Create a new user account.
 - POST /login    -> Verify email/password → generate JWT token → store token in cookie.
 - POST / logout  -> Clear the JWT token cookie.



=> profileRouter
 - GET /profile/view         -> See your own profile (only after login).
 - PATCH /profile/edit       -> Edit your profile details.
 - PATCH /profile/password   -> forgot / Change your password. -> allows a logged-in user to change their current password by giving:    old & new password



=> connectionRequestRouter
# sender side -> make 1 api for both     ->  http://localhost:7777/request/send/:status/:userId      [ "interested" , "ignored" ]
 - POST /request/send/interested/:userId      -> When you “Like” a developer (similar to right swipe).
 - POST /request/send/ignored/:userId         -> When you “Ignore” someone (left swipe).

# Reciever side ->  make i api for both    -> http://localhost:7777/request/review/:status/:requestId    [ "accepted" , "rejected" ]
 - POST /request/review/accepted/:requestId      -> You accept someone’s interested request.
 - POST /request/review/rejected/:requestId      -> You reject someone’s interest.





=> userRouter
 - GET /user/requests/recieved       -> Show all requests sent TO you that are still pending.
 - GET /user/connections             -> Show all people you matched with (mutual interests).
 - GET /user/feed                    -> gets you the profile of other users on platform || Shows you new developer profiles 
        


# => /feed api  ( Why? )
 - User should see all the cards except : 
 1 - his own card
 2 - his connections
 3 - he ignored peoples
 4 - he already sent connection requests people

 

 # => status : ignore, interedted, accepted, rejected


# pagination  (logic)    skip the and limit the users        // .skip & .limit is extracted from =>  req.query.page   &.  req.query.limit
#  http://localhost:7777/feed?page=1&limit=3     =>  gives only 3 records

- /feed?page=1&limit=10  => .skip(0)  & .limit(10)
- /feed?page=2&limit=10  => .skip(10) & .limit(10)
- /feed?page=3&limit=20  => .skip(20) & .limit(10)


# .skip()   - FORMULA

-  formula to get the no.of users skip 

skip = (page - 1) * limit        //    ex : page = 2     //  skip = (2 - 1) * 10  => users from 10 - 20