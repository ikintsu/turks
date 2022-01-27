const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes')
const dbo = require('./mongoconn');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/gettattoo', routes.get_single_tattoo);
app.post('/posttattoo', routes.post_tattoo);



dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(3002, () => {
      console.log('server running')
  });
});


// module.exports = app;
