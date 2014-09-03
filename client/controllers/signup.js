Template.customLoginBtns.helpers({
});
Template.customLoginBtns.events({
  'click .facebook-big-btn' : function(){
    Meteor.loginWithFacebook();
  },
  'click a.signinlink': function(){
    Session.set('signin-view', true);
  },
  'click a.createlink': function(){
    Session.set('signin-view', false);
  },
  'click .signup-btn': function(e){
    e.preventDefault();
    var p = $('#signup-password').val().trim(),
        cp= $('#signup-password-confirm').val().trim();
    if (p != cp){
      //do something error-y
    } else {
      Accounts.createUser({
        email: $('#signup-email').val().trim(),
        password: p
      });
    }
  },
  'click .signin-btn': function(e){
    e.preventDefault();
    var p = $('#signin-password').val().trim(),
        e = $('#signin-email').val().trim();
    Meteor.loginWithPassword({email: e}, p);
  }
});
