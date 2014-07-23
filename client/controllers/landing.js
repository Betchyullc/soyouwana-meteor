var next = function(e){
  if (Session.get('charity') == undefined) {
    $('.box').animate({left: '-33%'},500);
    setTimeout(function(){
      if (Session.get('goal')) {
        if (Session.get('deadline')){
          Session.set('charity', $('input').val());
          var goalId = Goals.insert({
            charity: Session.get('charity'),
            goal: Session.get('goal'),
            deadline: Session.get('deadline'),
            owner: Meteor.userId(),
            created_at: Date.now()
          });
          Session.set('goalId', goalId);
        } else {
          Session.set('deadline', $('input').val());
        } 
      } else {
        Session.set('goal', $('input').val());
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
  'keypress' : function(e){
    if(e.keyCode == 13)
      next();
  }
});

Template.yourGoal.rendered = function(){
  $('.box').css("left", '101%');
  $('.box').animate({left:'33%'}, 600);
//  $('input').focus();
};
Template.deadline.rendered = Template.yourGoal.rendered;
Template.charity.rendered = Template.yourGoal.rendered;
Template.signup.rendered = Template.yourGoal.rendered;
Template.finalInfo.rendered = function(){
  Template.yourGoal.rendered();
  Goals.update(Session.get('goalId'), {$set: {owner : Meteor.userId()}});
};
