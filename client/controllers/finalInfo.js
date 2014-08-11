Template.finalInfo.goalId = function(){
  return Session.get('goalId');
};

Template.finalInfo.created = function(){
  window.location.pathname = "/goal/"+Session.get('goalId')+"/edit";
};
