Template.findGoal.helpers({
  goals : function(){
    var s = Session.get('search');
    if (s == '' || s == undefined){
      return Goals.find({}).fetch();  
    } else if (s != undefined) {
      return Goals.find({goal: {$regex: s, $options: 'i'}}).fetch();
    }
  },
  resultCount : function(){
    var s = Session.get('search');
    if (s == '' || s == undefined){
      return Goals.find({}).count();  
    } else if (s != undefined) {
      return Goals.find({goal: {$regex: s, $options: 'i'}}).count();
    }
  },
  ownerName : function(){
    var u = Meteor.users.findOne(this.owner)
    if (u)
      return u.profile.name;
    else
      return "";
  },
  raisedAmount : function(){
    var goalId = this._id;
    Meteor.call('amountRaised', this, function(err, res){
      if(Session.get('amt-'+goalId) != res && res != 0)
        Session.set('amt-'+goalId, res);
    });
    return Session.get('amt-'+goalId) || "0";
  },
  donorCount : function(){
    var goalId = this._id;
    Meteor.call('donorCount', goalId, function(err, res){
      if(Session.get('donors-'+goalId) != res && res != 0)
        Session.set('donors-'+goalId, res);
    });
    return Session.get('donors-'+goalId) || "0";
  },
  daysToGo : function(){
    var cur = new Date();
    var fin = new Date(this.deadline);
    if (fin - cur > 0 )
      return parseInt((fin - cur) / (1000*60*60*24));
    return "--";
  }
});
