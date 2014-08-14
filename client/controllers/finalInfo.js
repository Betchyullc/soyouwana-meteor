Template.finalInfo.goalId = function(){
  return Session.get('goalId');
};

Template.finalInfo.created = function(){
  Router.go( "/goal/"+Session.get('goalId')+"/edit?first=true");
};
