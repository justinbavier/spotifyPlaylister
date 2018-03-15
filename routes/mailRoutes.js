var request = require('superagent');
var querystring = require('querystring');

var mailchimpInstance   = 'us17',
    listUniqueId        = '9e659d8ef7',
    mailchimpApiKey     = 'f4dbb5f9d0ec361353a9dff124189103-us17';

module.exports = app => {
  app.post('/email', function(req, res) {
    let email = req.query.email;
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'pending',
          'merge_fields': {
            'FNAME': 'FNAME',
            'LNAME': 'LNAME'
          }
        })
        .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.redirect('/success');
        } else {
        // res.send('Sign Up Failed :(')
        // .then(console.log(err))
        console.log(err)
        res.redirect('/fail');
      }
    });
  });
}
