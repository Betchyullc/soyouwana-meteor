Donations = new Meteor.Collection("donations");
if (Meteor.isServer) {
  Meteor.publish("donation", function(id){
    return Donations.find({_id: id}, {fields: {customer: 0}});
  });
  Meteor.publish("donationsForGoal", function(goalId){
    return Donations.find({goalId: goalId}, {fields: {customer: 0}});
  });

  Donations.allow({
    insert: function (userId, doc) {
      //existence checking
      return doc.amount && doc.created_at 
             && doc.customer && doc.goalId
             && doc.name 
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
