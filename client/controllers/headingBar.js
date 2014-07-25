Template.headingBar.helpers({
  sessionGet : function(key){
    return Session.get(key);
  }
});
Template.headingBar.events({
  'keypress #search': function(e){
    if (window.location.pathname != '/search') {
      window.setTimeout(function(){
        Session.set('search', $('#search').val());
        Router.go('findGoal');
      },300);
    } else {
      window.setTimeout(function(){
        Session.set('search', $('#search').val());
      },300);
    }
  }
});
