const express = require('express');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const SECRET_ADMIN_KEY = "S3cr3t";
const SECRET_USER_KEY = "S3cr3tus3r";
const generateTokenAdmin=(user)=>{
  //console.log("in tokemn")
    payload = {username:user};
    const token=jwt.sign(payload,SECRET_ADMIN_KEY,{expiresIn:'1h'});
    //console.log(token);
    return token;
}

const authenticateAdmin =(req, res, next)=>{
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  if(authHeader){
      const token = authHeader.split(" ")[1];
      jwt.verify(token,SECRET_ADMIN_KEY,(err,decoded)=>{
        if(err) {
          res.status(401).send("Unauthorized");
        }
        else {
          req.user = decoded.username;
          next();
        }
      })
  }
  else{
    res.status(401).send("Unauthorized");
  }
}

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  const data =  req.body;
  admin = ADMINS.find(a=>data.email===a.email && data.password === a.password);
  if(admin){
    res.status(403).send("Admin Already Exist");
  }
  else{
    ADMINS.push(data);
    const token=generateTokenAdmin(data.email,SECRET_ADMIN_KEY);
    res.status(200).json({ message: 'Admin created successfully', token: token });
  }
});

app.post('/admin/login', (req, res) => {
  const {email,password}  = req.body;
  const admin = ADMINS.find(a=>a.email===email && a.password===password);
  if(admin){
    const token = generateTokenAdmin(email,SECRET_ADMIN_KEY);
    res.status(200).send( { message: 'Logged in successfully', token: token });
  }
  else{
    res.status(403).json({ message: 'Admin authentication failed' });
  }
  
});

app.post('/admin/courses', authenticateAdmin, (req, res) => {
  console.log(req.user);
  res.status(200);
  
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
