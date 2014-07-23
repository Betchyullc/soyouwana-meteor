Goals = new Meteor.Collection("goals");
if (Meteor.isServer) {
  Meteor.publish("goalAndDonations", function(id){
    return [
      Goals.find({_id: id}),
      Donations.find({goalId: id})
    ];
  });
  Meteor.publish("goals", function(){
    return Goals.find({});
  });
}
