require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns')
const app = express();
const urlParser=require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
var urlStored=new Map();
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl',async function(req,res){
  const url = req.body.url;
  console.log("hello api: "+url);
  const parsedURL=new URL(url);
  const hostname=parsedURL.hostname;
  dns.lookup(hostname,(err,address)=>{
    if(err||!address){
      return res.json({ error: "Invalid URL" });
    }else{
      let id = Math.floor(Math.random() * 99); 
      urlStored.set(id, url);

      res.json({ original_url : url, short_url : id});
    }
  });

  
});
app.get('/api/shorturl/:id',(req,res)=>{
  const urlID=parseInt(req.params.id);
  const getURL=urlStored.get(urlID);
  if(getURL){
    res.redirect(getURL);
  }else{
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
