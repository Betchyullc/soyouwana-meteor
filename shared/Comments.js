Comments = new Meteor.Collection("comments");
if (Meteor.isServer) {
  Meteor.publish("comment", function(id){
    return Comments.find({_id: id});
  });
  Meteor.publish("commentsForGoal", function(goalId){
    return Comments.find({goalId: goalId});
  });

  Comments.allow({
    insert: function (userId, doc) {
      //existence checking
      return doc.msg          && doc.created_at 
             && doc.uid       && doc.goalId
             && doc.user_name && doc.user_pic
             ;
    },
    update: function (userId, doc, fields, modifier) {
      return userId && doc.uid == userId   // only modify your own doc
             && !_.contains(fields, 'created_at')// can't change history
             ;
    },
    remove: function (userId, doc) {
      return false;
    }
  });
}
