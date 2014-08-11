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
      if(Session.get('amt-'+goalId) != res)
        Session.set('amt-'+goalId, res);
    });
    return Session.get('amt-'+goalId);
  }
});
