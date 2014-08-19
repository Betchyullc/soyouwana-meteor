Goals = new Meteor.Collection("goals");
if (Meteor.isServer) {
  Meteor.publish("goalAndDonations", function(id){
    return [
      Goals.find({_id: id}),
      Donations.find({goalId: id}, {fields: {customer: 0}}),
      Comments.find({goalId: id})
    ];
  });
  Meteor.publish("goal", function(id){
    return Goals.find({_id: id});
  });
  Meteor.publish("goals", function(){
    return Goals.find({});
  });
  
  Goals.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc, fields, modifier) {
      // the user must be logged in, 
      // the document must be owned by the user,
      // the created_at, and owner fields CANNOT be changed
      // the deadline must be in the future
      var date_good;
      if (_.contains(fields, 'deadline')){
        var parts = modifier.$set.deadline.split('/');
        date_good = new Date(doc.created_at) < new Date(parts[2], parts[0]-1, parts[1]);
      } else {
        date_good = true;
      }
      return userId 
             && (doc.owner === userId || doc.owner === null)
             && !_.contains(fields, 'created_at')
             && (doc.owner === null || !_.contains(fields, 'owner'))
             && date_good;
    },
    remove: function (userId, doc) {
      // can only remove your own documents
      return doc.owner === userId;
    }
  });
}
