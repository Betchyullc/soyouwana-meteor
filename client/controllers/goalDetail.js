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
    return parseFloat(amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
  },
  donatorCount : function(){
    return Donations.find({goalId: this._id}).count();
  },
  timeLive : function(){
    return parseInt((Date.now() - this.created_at)/(1000*60*60*24));
  },
  donation : function(){
    return Donations.find({goalId: this._id});
  },
  donationCount : function(){
    return Donations.find({goalId: this._id}).count();
  },
  amountF : function(){
    return parseFloat(this.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
  }
});
