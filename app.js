const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//scrapers
const cheerio = require('cheerio');
const request = require('request');

const db = require('./models');

// Load models
require('./models/comment');
require('./models/story');

// Passport config
require('./config/passport')(passport);

// Load routes
// const index = require('./routes/index');
// const auth = require('./routes/auth');
// const stories = require('./routes/stories');

app.get("/", function(req, res) {
        let query = Story.find({}).sort({$natural: -1}).limit(10);
  
        query.exec(function(err, docs){
  
            if(err){
              throw error;
            }
  
            res.render("index",{story: docs});
        });
      });
  
//chosen url to scrape
app.get("/scrape", function(req, res) {
  
    request("https://news.ycombinator.com", function(error, response, html) {
  
      var $ = cheerio.load(html);
  
      $("div.listEntry").each(function(i, element) {
  
            let result = {};
  
            result.title = $(this).find("div.meta").find("h3").find("a").text();
            result.link =  $(this).find("a").attr("href");
            result.image = $(this).find("a").find("img").attr("data-img");
        
            console.log(result);
  
            let entry = new Story(result);
  
            entry.save(function(err, doc) {
  
              if (err) {
                console.log(err);
              }
              else {
                console.log(doc);
              }
        });
      });
  });  
      res.redirect("/");
});

  
  app.get("/stories", function(req, res) {
    Story.find({}, function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
  });
  
  app.get("/stories/:id", function(req, res) {
    Story.findOne({ "_id": req.params.id })
    .populate("note")
    .exec(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
  });
  
  // Load keys
const keys = require('./config/keys');

// Handlebars helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, {
  useMongoClient:true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate:formatDate,
    select:select,
    editIcon: editIcon
  },
  defaultLayout:'main'
}));

app.set('view engine', 'handlebars');

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// // Use routes
// app.use('/', index);
// app.use('/auth', auth);
// app.use('/stories', stories);

//site being scraped
app.get("/saved", function(req,res){
  
      Story.find({saved:true}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        res.render("saved",{story: doc});
      }
    });
  
  });
  
app.post("/updates/:id", function(req,res){
  
    Story.where({ _id: req.params.id }).update({ $set:{saved: true }})
  
      .exec(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
  
      res.json(doc)
      }
    });
  
  });
  
app.post("/updates/:id/:saved", function(req,res){
  
    Story.where({_id: req.params.id, saved:true }).update({ $set:{saved: false }})
  
      .exec(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
  
      res.json(doc)
      }
    });
  
  });
  
  // Post comments
  app.post("/comments/:id", function(req, res) {
    let newComment = new Comment(req.body);
    console.log(newComment);
  
     newComment.save(function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
         Story.findOneAndUpdate({ "_id": req.params.id },{ "comment": doc._id })
        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            res.send(doc);
          }
        });
      }
    });
  });
  
app.get("/comments/:id", function(req, res) {
    Story.findOne({ "_id": req.params.id })
    .populate("comment")
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }

      else {
        res.json(doc);
      }
    });
  });

//port

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});