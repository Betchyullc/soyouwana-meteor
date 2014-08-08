Donations = new Meteor.Collection("donations");
if (Meteor.isServer) {
  Meteor.publish("donation", function(id){
    return Donations.find({_id: id});
  });
  Meteor.publish("donationsForGoal", function(goalId){
    return Donations.find({goalId: goalId});
  });

  Donations.allow({
    insert: function (userId, doc) {
      //existence
      return doc.amount && doc.created_at 
             && doc.customer && doc.goalId
             && doc.msg && doc.name 
             ;
    },
    update: function (userId, doc, fields, modifier) {
      return false;
    },
    remove: function (userId, doc) {
      return false;
    }
  });
}
