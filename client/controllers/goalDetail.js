Template.goalDetail.helpers({
  ownersGoal : function(){
    // `this` is the object representing the goal
    return Meteor.userId() == this.owner;
  },
  donatedAmount : function(){
    var amt = 0;
    var dons = Donations.find({goalId: this._id}).fetch();
    for( var i = 0; i < dons.length; i++){
      amt += parseInt(dons[i].amount);
    }
    return amt;
  },
  donatorCount : function(){
    return Donations.find({goalId: this._id}).count();
  },
  timeLive : function(){
    return parseInt((Date.now() - this.created_at)/(1000*60*60*24));
  },
});
