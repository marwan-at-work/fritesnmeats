import sourceMaps from 'source-map-support';
if (process.env.NODE_ENV !== 'production') {
  sourceMaps.install();
}

import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';

import validateOrder from './utils/validate-order';
import processOrder from './utils/process-order';
import botw from './utils/botw';
const TOKEN = '$2a$10$PaERCPVrl6/iKl1SceAOMuWgOvnJYXIXl.0iCy1W95E7jNQylxXEK';

const app = express();
const port = process.env.PORT || '4321';

var path = require('path');
app.use(express.static(path.join(__dirname, 'build/utils')));
const urlencodedParser = bodyParser.urlencoded({ extended: false });

botw();


app.post('/', urlencodedParser, function(req, resp) {
  const { token, text, user_name } = req.body;

  if (!bcrypt.compareSync(token, TOKEN)) {
    return resp.status(400).send("UNAUTHORIZED_TOKEN");
  }

  try {
    const order = text.split(' ')[0].toLowerCase();
    validateOrder(order);

    const orderInfo = text.toLowerCase().split(' ').slice(1).join(' ');
    processOrder(user_name, order, orderInfo, resp);
  } catch (e) {
    return resp.status(400).send(`You will never know what went wrong; jk here it is: ${e}`);
  }
});

app.get('/', function(req, resp) {
  return resp.status(200).send('Welcome to fritesnmeats slack integration');
})

app.listen(port);
console.log(`server started on ${port}`);
