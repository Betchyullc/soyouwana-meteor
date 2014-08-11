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
  },
  winGoal : function(_id){
    Goals.update(_id, {$set:{finished:true}});
    _.each(Donations.find({goalId: _id}).fetch(), function(e, i, l){
      if (e.submitted == true) return;
      var result = Async.runSync(function(done){
        gateway.transaction.sale({
          customerId: e.customer,
          amount: e.amount,
          options: {
            submitForSettlement: true
          }
        }, function(err,res){
          done(err, res);
        });
      });
      console.log(result);
      if (result.result.success) {
        Donations.update(e._id, { $set : { submitted: true }});
        // call the api to pay the charity
      }
    });
  },
  amountRaised : function(goal){
    var amt = 0;
    _.each(Donations.find({goalId: goal._id}).fetch(),function(e, i, l){
      amt += parseInt(e.amount);
    });
    return amt;
  }
});
