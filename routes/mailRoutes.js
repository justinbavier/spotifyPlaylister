var request = require('superagent');
var querystring = require('querystring');
require('dotenv').config();

var mailchimpInstance = process.env.mailchimpInstance,
  listUniqueId = process.env.listUniqueId,
  mailchimpApiKey = process.env.mailchimpApiKey;

module.exports = app => {
  app.post('/email', function(req, res) {
    let email = req.query.email;
    let FNAME = req.query.FNAME;
    let LNAME = req.query.LNAME;
    request
      .post(
        'https://' +
          mailchimpInstance +
          '.api.mailchimp.com/3.0/lists/' +
          listUniqueId +
          '/members/'
      )
      .set('Content-Type', 'application/json;charset=utf-8')
      .set(
        'Authorization',
        'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64')
      )
      .send({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: FNAME,
          LNAME: LNAME
        }
      })
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === 'Member Exists')
        ) {
          res.send('worked');
        } else {
          // res.send('Sign Up Failed :(')
          // .then(console.log(err))
          console.log(err);
          res.send('did not work');
        }
      });
  });
};
