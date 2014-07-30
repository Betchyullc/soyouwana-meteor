var bt = Meteor.require('braintree');
var gateway = bt.connect({
  environment: bt.Environment.Sandbox,
  merchantId: 'vfhpwqw9g896qnzh',
  publicKey: 'p8s4g5cpczwqj3gp',
  privateKey: '97f4b0a67bf1974bea764beccd95f8f4'
});
var clientToken = "";
Meteor.methods({
  twitter_share_count : function(url) {
    return HTTP.get('http://urls.api.twitter.com/1/urls/count.json?url='+url);
  },
  donate : function(nonce, name){
    if(name == "") name = "Anonymous";
    var result = Async.runSync(function(done){
      gateway.customer.create({
        firstName: name,
        paymentMethodNonce: nonce
      }, function(err, data){
        done(null, data);
      });
    });
    return result;
  },
  clientToken : function(){
    if(clientToken == ""){
      clientToken = Async.runSync(function(done){
        gateway.clientToken.generate({
        //  customerId: aCustomerId
        }, function (err, response) {
          done(err, response.clientToken);
        });
      });
    }
    return clientToken;
  }
});
