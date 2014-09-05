// setup lib for xml to json
var parseString = Meteor.npmRequire('xml2js').parseString;

var fgAPI = function(targetAddr,contentString){
    return Async.runSync(function(done){
      parseString( HTTP.call("POST", FG.endpoint+targetAddr, {
        headers: {
          "JG_APPLICATIONKEY" : FG.key,
          "JG_SECURITYTOKEN" :  FG.token
        },
        content: contentString
      }).content, function(err,res){
        done(err, res);
      });
    });
};

Meteor.methods({
  twitter_share_count : function(url) {
    return HTTP.get('http://urls.api.twitter.com/1/urls/count.json?url='+url);
  },
  donate : function(cardData) {
    var content= "ccNumber="+cardData.number+
                 "&ccType="+cardData.cardType+
                 "&ccExpDateYear="+cardData.expiration.substr(3,2)+
                 "&ccExpDateMonth="+cardData.expiration.substr(0,2)+
                 "&ccCardValidationNum="+cardData.cvv+
                 "&accountName="+cardData.first+"+"+cardData.last+
                 "&billToFirstName="+cardData.first+
                 "&billToLastName="+cardData.last+
                 "&billToAddressLine1="+cardData.addr+
                 "&billToCity="+cardData.city+
                 "&billToZip="+cardData.zip+
                 "&billToCountry=US&billToEmail="+cardData.email+
                 "&billToState="+cardData.state+
                 "&remoteAddr="+FG.localIp;
    var fgResponse = fgAPI("cardonfile", content).result.firstGivingDonationApi.firstGivingResponse;
    console.log(fgResponse);
    return fgResponse;
  },
  winGoal : function(_id){
    Goals.update(_id, {$set:{finished:true}});
    var g = Goals.findOne(_id);
    var u = Meteor.users.findOne(g.owner);
    _.each(Donations.find({goalId: _id}).fetch(), function(e, i, l){
      // handle email alerts
      if (e.email && u) {
        Email.send({
          to: e.email,
          from: "Reachrr <noreply@reachrr.com>",
          subject: u.profile.name + " has succeeded!",
          text: "You supported "+u.profile.name + "'s goal, and now they've done it! Your card will be charged, and your donation sent.\nBe sure to congratulate your friend."
        });
      }
      //handle money
      if (e.submitted == true) return; // obviously, don't double-charge cards
      // call FG api to transact from cardonfile
      // supposedly, our cut comes out of this automatically
      var result = fgAPI("donation/creditcard", 
        "cardOnFileId="+e.customer+
        "&amount="+parseInt(e.amount)+".00"+
        "&remoteAddr="+FG.localIp+"&currencyCode=USD"+
        "&charityId="+g.charity_uuid+
        "&description=Reachrr+donation+on+behalf+of+users+completed+goal"
      );
      console.log(result.result);
      if (result.result && result.result.firstGivingDonationApi && result.result.firstGivingDonationApi.firstGivingResponse) {
        Donations.update(e._id, { $set : { submitted: true }});
        console.log(result.result.firstGivingDonationApi.firstGivingResponse);
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
    var g =Goals.findOne({owner: uid, finished: {$ne: true}});
    if(g)
      return g._id;
    return "";
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
      from: "noreply@reachrr.com",
      subject: "Support "+ u.profile.name + "'s Campaign",
      text: "Hello,\nI would like for you to support my campaign at Reachrr. I've made a goal to "+ g.goal +" in an effort to raise money for "+ g.charity+". The funds will only be donated when I succeed at my goal.\nReachrr is a crowdfunding website that helps people raise funds for causes by challenging them to achieve a personal goal.\n\nWill you show your support? http://www.reachrr.com/goal/"+gid+"\n\nThanks,\n"+u.profile.name
    });
  },
  sendEmail2: function(gid, bodyText){
    var u = Meteor.users.findOne(Goals.findOne(gid).owner);
    _.each(Donations.find({goalId: gid}).fetch(), function(e, i, l){
      if (e.email && u) {
        Email.send({
          to: e.email,
          from: "Reachrr <noreply@reachrr.com>",
          subject: u.profile.name + " says thanks!",
          text: bodyText
        });
      }
    });
  }
});
