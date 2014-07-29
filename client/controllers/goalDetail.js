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
    return Donations.find({goalId: this._id}, {skip: Session.get('skip') || 0, limit: 10});
  },
  donationCount : function(){
    return Donations.find({goalId: this._id}).count();
  },
  amountF : function(){
    return parseFloat(this.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
  },
  formatCreatedAt : function(){
    return (new Date(this.created_at)).toISOString();
  },
  donationShowingText : function(){
    var count = Donations.find({goalId: this._id}).count();
    return "<span class='bold'>"+(Session.get('skip') || 1)+" - "+Math.min((Session.get('skip') || 0)+10, count)+"</span> of <span class='bold'>"+count+"</span>";
  },
  previousDonations : function(){
    return (Session.get('skip') || 0) > 0;
  },
  nextDonations : function(){
    return (Session.get('skip') || 0)+10 < Donations.find({goalId: this._id}).count();
  }
});

Template.goalDetail.events({
  'click .next-donations':function(e){
    var count = Donations.find({goalId: this._id}).count();
    Session.set('skip', Math.min((Session.get('skip') || 0) + 10, Math.max(0, count - 10)));
    setTimeout(function(){jQuery("time.timeago").timeago();}, 1000);
  },
  'click .prev-donations':function(e){
    Session.set('skip', Math.max((Session.get('skip') || 0) - 10, 0));
    setTimeout(function(){jQuery("time.timeago").timeago();}, 1000);
  }
});

Template.goalDetail.rendered = function(){
  setTimeout(function(){jQuery("time.timeago").timeago();}, 1000);
};
