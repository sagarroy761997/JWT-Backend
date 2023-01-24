# JWT Backend
It is a backend application which do JWT authrization.

# Tools used
- node js
- express
- SQL

# Objective
To create a backend of login page which uses JWT token for autherization

# feature
- If we open the server first it will create atable name server in the database which will have email and password.
- there are 4 routes
- /signup route will save the data in the databse
- /login route will check the credentials and if they are correct or not. Aso sends the accessToken through a cookie if credentials are correct.
- /auth  route is which do the autherization with that available token.
- /logout will delete the cookie which has the accessToken

# Things Learned
- JWT token


![Screenshot (16)](https://user-images.githubusercontent.com/113674345/214229606-a4e2bff5-6f41-4bf0-8d27-57038f8947bb.png)



