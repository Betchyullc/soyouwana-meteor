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
    var u = Meteor.users.findOne(Goals.findOne(_id).owner);
    _.each(Donations.find({goalId: _id}).fetch(), function(e, i, l){
      // handle email alerts
      if (e.email && u) {
        Email.send({
          to: e.email,
          from: "noreply@reachrr.com",
          subject: u.profile.name + " has succeeded!",
          text: "You supported "+u.profile.name + "'s goal, and now they've done it! Your card will be charged, and your donation sent.\nBe sure to congratulate your friend."
        });
      }
      //handle money
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
  },
  donorCount : function(gid){
    return Donations.find({goalId: gid}).count();
  },
  getGoalForUser : function(uid){
    return Goals.findOne({owner: uid})._id;
  },
  photoUpload : function(url, context) {
    var g = Goals.findOne(context._id);
    if (g.photoURL)
      Meteor.call('S3delete', g.photoURL);
    Goals.update(context._id, { $set : {photoURL : url }});
  },
  makeUpdate : function(url, context){
    Goals.update(context._id, { $push : {
      updates: {
        msg: context.msg,
        photo: url,
        created_at: Date.now()
      }
    }});
  },
  sendEmail : function(gid,toList){
    var g = Goals.findOne(gid);
    if (g == undefined)
      return;
    var u = Meteor.users.findOne(g.owner);
    Email.send({
      to: toList,
      from: 'noreply@reachrr.com',
      subject: u.profile.name + "'s exciting new goal",
      text: u.profile.name + ' wants to ' + g.goal + " by " + g.deadline + " for charity!\n"+u.profile.name+" is raising money for "+ g.charity+ " and you can help.\nVisit this link for more information:\nhttp://www.reachrr.com/goal/"+gid
    });
  },
  sendEmail2: function(gid, bodyText){
    var u = Meteor.users.findOne(Goals.findOne(gid).owner);
    _.each(Donations.find({goalId: gid}).fetch(), function(e, i, l){
      if (e.email && u) {
        Email.send({
          to: e.email,
          from: "noreply@reachrr.com",
          subject: u.profile.name + " says thanks!",
          text: bodyText
        });
      }
    });
  }
});
