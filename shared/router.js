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
    waitOn: function() { return Meteor.subscribe('goal', this.params._id);},
    data: function() { return Goals.findOne(this.params._id); }
  });
  this.route('donate', {
    path: '/donate/:_id',
    data: function() { return this.params; }
  });
});
