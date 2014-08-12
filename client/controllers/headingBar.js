Template.headingBar.helpers({
  sessionGet : function(key){
    return Session.get(key);
  },
  userGoalId : function(){
    Meteor.call('getGoalForUser', Meteor.userId(), function(err, res){
      if (Session.get('thegoalnstuff') != res)
        Session.set('thegoalnstuff', res);
    });
    return Session.get('thegoalnstuff');
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
  },
  'mouseenter .login-link.dropdown': function(){
    $('.login-link span#drop-toggle').dropdown('toggle');
  },
  'click #logout-from-dropdown': Meteor.logout
});
