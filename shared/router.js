Router.configure({
  notFoundTemplate:'notFound',
  loadingTemplate: 'loading',
  layoutTemplate: 'layout'
});
Router.onBeforeAction(function(){
  Session.set('goal', undefined);
  Session.set('deadline', undefined);
  Session.set('charity', undefined);
  Session.set('goalId', undefined);
});
var accessBeforeAction = function(pause){
  var goal = Goals.findOne(this.params._id);
  if (!Meteor.user() || goal == undefined || Meteor.userId() != goal.owner) {
    // render the login template but keep the url in the browser the same
    this.render('notFound');

    // pause this rendering of the rest of the before hooks and the action function 
    pause();
  }
};
Router.map(function(){
  this.route('landing', {path: '/'});
  this.route('findGoal', {
    path: '/search',
    waitOn: function() { return Meteor.subscribe('goals');}
  });
  this.route('goalDetail', {
    path: '/goal/:_id',
    waitOn: function() { return Meteor.subscribe('goalAndDonations', this.params._id);},
    data: function() { return Goals.findOne(this.params._id); }
  });
  this.route('editGoal', {
    path: '/goal/:_id/edit',
    onBeforeAction: accessBeforeAction,
    waitOn: function() { return Meteor.subscribe('goalAndDonations', this.params._id);},
    data: function() { return Goals.findOne(this.params._id); }
  });
  this.route('donate', {
    path: '/donate/:_id',
    data: function() { return this.params; }
  });
});
