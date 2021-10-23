Documentations

  Thinking Process:
    - At first creating package.json and installing important modules such as ( express, mongodb, mongoose, dotenv, nodemon, jsonwebtoken, bcryptjs) 
    - Second creating folders and files to build project structure.
    - Using config folder and created file database.js to create connection with mongodb server using mongoose.
    - Using user.js controller file inside controller folder to implement nessary apis (register, login, logout).
    - Using auth.js middleware file inside middleware folder to check if user authenticated or not.
    - Using user.js model to implement user schema.
    - Using user.js router file to implement RESTful API routes and calling it in app.js file.
    
    Registeration service:
      - When the user trying to login the url "localhost:4001/user/register" called.
      - At first check if email & first_name & last_name & password is exist in req.body to validate it if not back with error as it required.
      - Check if user exist or not, if not back with error that user not exist, and if it not exist bcrypt bassword then store user in database, generate token, set session.
      - then back with token and user date.
       
    Login service:
      - When the user trying to login the url "localhost:4001/user/login" called.
      - At first check if email & password is exist in req.body to validate it if not back with error as it required.
      - Check if user exist or not, if not back with error that user not exist, and if it exist check bassword if correct ,then check email and bassword both are correct
        if it are correct set session and generate token, then back with token and user date.
    
    Logout service:
      - When the user trying to login the url "localhost:4001/user/logout" called.
      - At first check if session and token are exist or not, if exist remove it. if not exist sent to user that "you are not authenticated".
      
    Auth service:
      - When user called any page or trying any action need to be authenticated auth function called.
      - At first chect if session and token are exist or not.
      - Then if it exist check session is valid, if it valid decode token and back to api if allow the user to make action becouse user is authenticated,
      - If there any issue not allow to user make the action as user not authenticated.
      
 Useful Resources:
    - https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/ which explain who to use JWt in authentication.
    - https://www.coursera.org/learn/server-side-nodejs/ this course which I already studing in it.
