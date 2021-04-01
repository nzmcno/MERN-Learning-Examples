import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cards from "./dbCards.js";
import Cors from "cors";



// App Config
const app = express();
const port = process.env.PORT || 8001
dotenv.config()
const uri = process.env.ATLAS_URI;//.env dosyasi ekleyip icine degisken atayacagiz bu da baglanti icin olacak.


// Middlewares
app.use(express.json());
app.use(Cors());

// DB config
mongoose.connect(uri, {
    useUnifiedTopology:true,
    useNewUrlParser:true, 
    useCreateIndex:true});

// API Endpoints
app.get('/', (req, res)=> res.status(200).send('hello'))

app.post("/tinder/cards", (req, res) => {
    const dbCard = req.body;
  
    Cards.create(dbCard, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // console.log('success')
        res.status(201).send(data);
      }
    });
  });
  app.get("/tinder/cards", (req, res) => {
    Cards.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  });
// Listener
app.listen(port, ()=> console.log(`list on localhost ${port}`));
//