const express = require('express');
const low = require('./lowdb');
const multiparty = require('multiparty');
const fs = require('fs');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/cards', (req, res) => {
  res.json(low.getCards());
});

app.get('/api/layout', (req, res) => {
  res.json(low.getLayout());
});

app.get('/save/layout', (req, res) => {
  const param = req.query.q;


  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }
  low.saveLayout(param)
  res.json([]);

});

app.get('/save/card', (req, res) => {
  const param = req.query.q;


  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  res.json(low.saveCard(param));

});

app.get('/update/card', (req, res) => {
  const value = req.query.q;
  const key = req.query.key;


  if (!value || !key) {
    res.json({
      error: 'Missing required parameter',
    });
    return;
  }

  res.json(low.updateCard(key, value));

});

app.get('/delete/card', (req, res) => {
  const key = req.query.key;


  if (!key) {
    res.json({
      error: 'Missing required parameter',
    });
    return;
  }

  res.json(low.deleteCard(key));

});

app.post('/upload', (req, res) => {
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {

    let {path: tempPath, originalFilename} = files.imageFile[0];
    let extension = '.' + originalFilename.split('.').pop();
    var fileName = getRandomID();
    let newPath = "./client/public/images/" + fileName + extension;

    console.log(newPath);

    fs.readFile(tempPath, (err, data) => {
      // make copy of image to new location
      fs.writeFile(newPath, data, (err) => {
        if(err) throw err;
        // delete temp image
        fs.unlink(tempPath, () => {
          res.json({id: 'images/' + fileName + extension});
        });
      });
    });
  })
});

function getRandomID() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return "ID" + year + month + day + hour + min + sec + random(0,10000);

}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
