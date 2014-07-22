Goals = new Meteor.Collection("goals");
if (Meteor.isServer) {
  Meteor.publish("goal", function(id){
    return Goals.find({_id: id});
  });
  Meteor.publish("goals", function(){
    return Goals.find({});
  });
}
