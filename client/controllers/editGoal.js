Template.editGoal.helpers({
  userHasName : function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.name;
  },
  name : function(){
    return Meteor.user().profile.name;
  }
});
Template.editGoal.events({
  'click #savechanges' : function(e){
    Meteor.users.update(Meteor.userId(), {
      $set : {
        'profile.name': $('input#username').val()
      }
    });
    Goals.update(this._id, {
      $set : {
        goal: $('input#goal').val().trim(),
        deadline: $('input#deadline').val().trim(),
        charity: $('input#charity').val().trim(),
        whyGoal: $('textarea#whyGoal').val().trim(),
        whyCharity: $('textarea#whyCharity').val().trim(),
        photoURL: $('input#photoURL').val().trim(),
        videoEmbed: $('input#videoEmbed').val().trim()
      }
    });

  },
  'click #makeupdate': function(e){
    var msg = $('#update-msg').val().trim();
    if(msg == "") {
      $('#update-msg').css('border-color','red');
      setTimeout(function(){
        $('#update-msg').attr('style','');
      }, 444);
      return;
    }
    Goals.update(this._id, {
      $push : {
        updates: {
          msg: msg,
          created_at: Date.now()
        }
      }
    });
    alert('Update posted!');
    window.location.pathname = window.location.pathname.slice(0,-5);
  },
  'click .complete-goal-btn': function(e){
    Meteor.call('winGoal', this._id);
  }/*,
  'click' : function(e){
    var item = $(e.currentTarget);
    var name = e.currentTarget.nodeName;
    if(item.hasClass("editing")){
      name = item.attr("data-return");
      item.replaceWith("<"+name+">"+item.val().trim()+"</"+name+">");
    } else {
      item.replaceWith("<input class='editing' type='text' value='"+item.text().trim()+"' data-return='"+name+"'/>");
    }
  }*/
});

Template.editGoal.rendered = function(){
  $('input#deadline').datepicker();
};
