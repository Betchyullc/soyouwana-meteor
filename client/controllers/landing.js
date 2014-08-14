var isBad = function(val){
  if(val == "") return true;
  if (Session.get('goal')) {
    if (Session.get('deadline')){
    } else {
      var parts = val.split('/');
      return new Date() > new Date(parts[2], parts[0]-1, parts[1]);
    } 
  } else {
    return !_.contains(val, " ");
  }
  return false;
};
var next = function(e){
  var val = $('.goal-bar input').val().trim();
  if (isBad(val)){
    $('.goal-bar input').css('border-color','red');
    setTimeout(function(){
      $('.goal-bar input').attr('style','');
    }, 666);
    return;
  }
  if (Session.get('charity') == undefined) {
    $('.box').animate({left: '-33%'},500);
    setTimeout(function(){
      if (Session.get('goal')) {
        if (Session.get('deadline')){
          Session.set('charity', val);
          var goalId = Goals.insert({
            charity: Session.get('charity'),
            goal: Session.get('goal'),
            deadline: Session.get('deadline'),
            owner: Meteor.userId(),
            created_at: Date.now(),
            updates: []
          });
          Session.set('goalId', goalId);
        } else {
          Session.set('deadline', val);
        } 
      } else {
        Session.set('goal', val);
      }
    }, 600);
  }
};

Template.landing.helpers({
  noGoal : function(){
    return Session.get('goal') == undefined;
  },
  goal : function(){
    return Session.get('goal');
  },
  deadlineWithoutCharity : function(){ 
    return Session.get('deadline') != undefined
           && Session.get('charity') == undefined;
  },
  goalWithoutDeadline : function(){
    return Session.get('goal') != undefined
           && Session.get('deadline') == undefined;
  },
  theCharity : function(){
    return Session.get('charity');
  },
  goalMade : function(){
    return Session.get('goalId');
  }
});

Template.landing.events({
  'click button' : next,
  'click .back-btn': function(){
    Session.set('going back', true);
    if (Session.get('deadline')){
      Session.set('deadline', undefined);
    } else {
      Session.set('goal', undefined);
    } 
  },
  'keypress' : function(e){
    if(e.keyCode == 13)
      next();
  },
  'click .goal-bar img': function(){
    $('input#deadline').datepicker('show');
  }
});

Template.yourGoal.rendered = function(){
  if(Session.get('going back')){
    Session.set('going back', false);
    $('.box').css("left", '-33%');
    $('.box').animate({left:'33%'}, 600);
  } else {
    $('.box').css("left", '101%');
    $('.box').animate({left:'33%'}, 600);
  }
};
Template.deadline.rendered = function(){
  Template.yourGoal.rendered();
  $('input#deadline').datepicker({startDate: "+1d", autoclose: true});
};
Template.charity.rendered = Template.yourGoal.rendered;
Template.signup.rendered = Template.yourGoal.rendered;
Template.finalInfo.rendered = function(){
  Template.yourGoal.rendered();
  Goals.update(Session.get('goalId'), {$set: {owner : Meteor.userId()}});
};
