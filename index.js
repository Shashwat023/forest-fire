const express = require("express");
const app = express();
// const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");                    
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended: true}));   
// app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); 
app.use(express.json());
app.engine("ejs", ejsMate);

app.listen(8080, () => {
    console.log("server is listening");
});

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.get('/predict', (req, res) => {
  res.render('predict', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.get('/simulate', (req, res) => {
  res.render('simulate', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.post("/simulate-fire", (req, res) => {
  const { coords } = req.body;

  if (!coords) {
    return res.status(400).json({ message: "Coordinates are required." });
  }

  // Simulate fire spread here (you can later plug in your ML model)
  console.log("Simulating fire at:", coords);

  // Dummy response for now
  return res.json({
    success: true,
    images: {
      "1hr": "/images/1hr.png",
      "2hr": "/images/2hr.png",
      // ...
    },
    stats: {
      "1hr": "15 hectares",
      "2hr": "45 hectares",
      // ...
    },
  });
});


app.get('/download', (req, res) => {
  res.render('download', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

// app.post('/predict', (req, res) => {
//   // Process prediction
//   res.render('predict', { 
//     title: 'Predict', 
//     currentPage: 'predict',
//     prediction: results 
//   });
// });