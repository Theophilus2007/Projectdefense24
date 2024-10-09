//import node documentaries
const express = require('express');
const app = express();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const ejs = require('ejs')
const cookieparser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

//middleware
app.use(express.json())
app.use(express.static('public'))
app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

//create connection for mysql database
const sqlconnection = mysql.createConnection({
    user:"Miracle",
    host:"localhost",
    password:"Miracle123",
    port:"3306",
    database:"petcare"
});
//connecting to mysql database
sqlconnection.connect((err)=>{
    if (err) throw err
    console.log('Database connected')
})


app.get('/index',(req, res)=>{
  res.render('index.ejs')
})
app.get('/about',(req, res)=>{
  res.render('about.ejs')
})
app.get('/pricing',(req, res)=>{
  res.render('pricing.ejs')
})
app.get('/appointment',(req, res)=>{
  res.render('appointment.ejs',{message:""})
})



app.get('/contact',(req, res)=>{
  res.render('contact.ejs',{message:""})
})
app.get('/services',(req, res)=>{
    res.render('services.ejs')
  })
app.get('/login',(req, res)=>{
  res.render('login.ejs')
})

app.get('/admin',(req, res)=>{
    res.render('homepage.ejs')
  })
  
  app.get('/logout', (req, res)=>{
    res.cookie('jwt', "",{
      maxAge:1,
  })
  res.redirect('/index')
})


    //Book an Appointment
app.post('/appointment', (req, res)=>{
    const databaseConnection = mysql.createConnection({
      user:"Miracle",
      host:"localhost",
      password:"Miracle123",
      port:"3306",
      database:"petcare"
  })
  databaseConnection.connect((err)=>{
    if(!err){
      databaseConnection.query('select * from appointment where Fullname = ?',
        [req.body.Fullname], (err, result)=>{
        if(!err){
          if(result.length > 0){
            const message = "A User with the  appointment  nameexist!"
            res.render('appointment.ejs', {message})
  
          }else{
            
            databaseConnection.query
            ('insert into appointment(Fullname, email, petspecies, medicalinfo, behavior, medicalhistory)values(?, ?, ?, ?, ?, ?)',
              [req.body.Fullname, req.body.email, req.body.petspecies, req.body.medicalinfo, req.body.behavior, req.body.medicalhistory],
               (err)=>{
                if(!err){
                  const message = "An Appointment booked successful"
                  res.render('appointment.ejs', {message})
                }
              })
          }
        }
      })
    }
  })
  })
  
  //recieve an appointment
  app.get('/appointment/submit',(req, res)=>{
    const databaseConnection = mysql.createConnection({
      user:"Miracle",
      host:"localhost",
      password:"Miracle123",
      port:"3306",
      database:"petcare"
    })
    databaseConnection.connect((err)=>{
      if(!err){
        databaseConnection.query('select * from appointment', (err, result)=>{
          res.json(result)
       })
      }
    })
    })
      //Contact
app.post('/contact', (req, res)=>{
  const databaseConnection = mysql.createConnection({
    user:"Miracle",
    host:"localhost",
    password:"Miracle123",
    port:"3306",
    database:"petcare"
})
databaseConnection.connect((err)=>{
  if(!err){
    databaseConnection.query('select * from contact where email = ?',
      [req.body.email], (err, result)=>{
      if(!err){
        if(result.length > 0){
          const message = "Reviews with the Name is submitted Email"
          res.render('contact.ejs', {message})

        }else{
          
          databaseConnection.query
          ('insert into contact(fullname, email, problem, review)values(?, ?, ?, ?)',
            [req.body.fullname, req.body.email, req.body.problem, req.body.review],
             (err)=>{
              if(!err){
                const message = "Review Submittedl"
                res.render('contact.ejs', {message})
              }
            })
        }
      }
    })
  }
})
})

//recieve an appointment
app.get('/contact/submit',(req, res)=>{
  const databaseConnection = mysql.createConnection({
    user:"Miracle",
    host:"localhost",
    password:"Miracle123",
    port:"3306",
    database:"petcare"
  })
  databaseConnection.connect((err)=>{
    if(!err){
      databaseConnection.query('select * from contact', (err, result)=>{
        res.json(result) 
     })
    }
  })
  })
  app.listen(5000)