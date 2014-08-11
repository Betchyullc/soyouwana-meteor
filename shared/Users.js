if (Meteor.isServer){
  Meteor.publish("users", function(){
    return Meteor.users.find({}, {fields: {profile: 1}});
  });
} else {
  Meteor.subscribe("users");
}
