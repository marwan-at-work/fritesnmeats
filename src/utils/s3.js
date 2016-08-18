const { S3 } = require('aws-sdk');
const s3 = new S3;
const params = { Bucket: 'frites', Key: 'test.json' };
const db = {};

async function getOrCreateUser(userName) {
  if (db[userName]) return db[userName];

  const userParams = { ...params, Key: `${userName}.json` };
  const user = await getS3Object(userParams);
  db[userName] = user;
  return user;
}

function updateUser(userName, body) {
  db[userName] = body;

  const userParams = {
    ...params,
    Key: `${userName}.json`,
    Body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    s3.upload(userParams, function(e, d) {
      if (e) {
        reject(e);
      }
      resolve(true);
    });
  });
}

function getS3Object(givenParams) {
  return new Promise((resolve, reject) => {
    s3.getObject(givenParams, function(e, d) {
      if (e && e.code !== 'NoSuchKey') reject(e.code);
      if (e && e.code === 'NoSuchKey') {
        resolve({});
      }
      if (!e && d) {
        const userData = JSON.parse(d.Body);
        resolve(userData);
      }
    });
  });
}

export { getOrCreateUser, updateUser };
