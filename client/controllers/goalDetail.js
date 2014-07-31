var readablizeNumber = function(size) {
  var sizePrefixes = ' KMBTQ';
  if(size <= 0) return '0';
  var t2 = Math.min(Math.round(Math.log(size)/Math.log(1000)), 5);
  return parseInt(Math.round(size * 100 / Math.pow(1000, t2)) / 100) + sizePrefixes.charAt(t2).replace(' ', '');
}
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
  formatCreatedAt : function(c_a){
    if (c_a) return (new Date(c_a)).toISOString();

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
  },
  totalShares : function(){
    HTTP.get("https://graph.facebook.com/fql?q=SELECT url, normalized_url, share_count, like_count, comment_count, total_count,commentsbox_count, comments_fbid, click_count FROM link_stat WHERE url='http://www.soyouwana.com/goal/"+this._id+"'", {}, function(err, res){
      Session.set('fb-share-count', res.data.data[0].total_count);
    });
    Meteor.call('twitter_share_count','http://www.soyouwana.com/goal/'+this._id, function(err, res){
      Session.set('twit-share-count', res.data.count);
    });
    return "<span id='share-count'>"+readablizeNumber((Session.get('fb-share-count') || 0) + (Session.get('twit-share-count') || 0))+"</span>";
  },
  sortedUpdates : function(){
    return _.sortBy(this.updates, function(obj){
      return -1*obj.created_at;
    });
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
