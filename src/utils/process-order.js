import fs from 'fs';
import mailer from 'nodemailer';
import moment from 'moment-timezone';
import { getOrCreateUser, updateUser } from './s3';

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.FNMP
  }
};

const mailOpts = {
  from: process.env.MY_EMAIL,
  to: process.env.PHONE_NUMBER,
  subject: 'Food Order',
};

const transporter = mailer.createTransport(smtpConfig);

export default function(userName, order, orderInfo, resp) {
  switch (order) {
    case 'addOrder':
      return addOrder(userName, orderInfo, resp).catch(err => { throw err });
    case 'order':
    case ':hamburger:':
      return makeOrder(userName, resp).catch(err => { throw err });
    case 'alias':
      return makeAlias(userName, orderInfo, resp).catch(err => { throw err });
    case 'whatsMyOrder':
      return showOrder(userName, resp).catch(err => { throw err });
    default:
      throw new Error(`unknown order: ${order}`);
  }
}

async function addOrder (userName, orderInfo, resp) {
  const user = await getOrCreateUser(userName);
  user.orderInfo = orderInfo;
  const saved = await updateUser(userName, user);
  if (saved) {
    resp.status(200).send('Success. Make an order with `/fritesnmeats order` or `/fritesnmeats :hamburger:`');
  } else {
    resp.status(400).send('Wherever I keep your order, did not like to keep your order');
  }
}

async function makeOrder(userName, resp) {
  const user = await getOrCreateUser(userName);
  const order = user.orderInfo;
  if (!order) {
    return resp.status(400).send('You must first register an order with /fritesnmeats addOrder [order]');
  }

  const lastOrdered = user.ordered;
  const lastOrderedMoment = lastOrdered && moment.tz(lastOrdered, 'America/New_York');
  const nowInNYC = moment.tz('America/New_York');
  const userOrderedToday = lastOrderedMoment && nowInNYC.diff(lastOrderedMoment, 'days') === 0;
  if (userOrderedToday) {
    return resp.status(200).send('You already made an order today');
  }

  const thisHourInNYC = nowInNYC.format('HH');
  if (!['10', '11', '12', '13'].includes(thisHourInNYC)) {
    return resp.status(400).send('Order window is between 10AM-2PM');
  }

  mailOpts.text = order;
  mailOpts.subject = `Food Order for ${user.alias || userName}`;
  transporter.sendMail(mailOpts, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      resp.status(400).send('Could not make order :(');
    } else {
      user.ordered = moment.tz('America/New_York').format('YYYY-MM-DD');
      updateUser(userName, user);
      resp.status(200).send(`You just ordered ${order}`);
    }
  });
}

async function makeAlias(userName, alias, resp) {
  const user = await getOrCreateUser(userName);
  if (!user.orderInfo) {
    return resp.status(400).send('You need to create an order first with /fritesnmeats addOrder');
  }

  user.alias = alias;
  const saved = await updateUser(userName, user);
  resp.status(200).send(`Your order will now be sent as ${alias}`);
}

async function showOrder(userName, resp) {
  const user = await getOrCreateUser(userName);
  if (!user.orderInfo) {
    return resp.status(400).send('You need to create an order first with /fritesnmeats addOrder');
  }

  resp.status(200).send(`Your order is: ${user.orderInfo}` || 'You might need to addOrder again');
}
