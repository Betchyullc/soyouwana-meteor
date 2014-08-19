Template.finalInfo.goalId = function(){
  return Session.get('goalId');
};

Template.finalInfo.created = function(){
  Goals.update(Session.get('goalId'), {$set: {owner : Meteor.userId()}});
  Router.go( "/goal/"+Session.get('goalId')+"/edit?first=true");
};
