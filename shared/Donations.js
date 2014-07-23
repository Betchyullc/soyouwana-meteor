Donations = new Meteor.Collection("donations");
if (Meteor.isServer) {
  Meteor.publish("donation", function(id){
    return Donations.find({_id: id});
  });
  Meteor.publish("donationsForGoal", function(goalId){
    return Donations.find({goalId: goalId});
  });
}
