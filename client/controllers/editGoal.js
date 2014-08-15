var selectText = function(element) {
  var doc = document;
  var text = doc.getElementById(element);    

  if (doc.body.createTextRange) { // ms
    var range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) { // moz, opera, webkit
    var selection = window.getSelection();            
    var range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
Template.editGoal.helpers({
  userHasName : function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.name;
  },
  name : function(){
    return Meteor.user().profile.name;
  },
  amountRaised : function(){
    var amt = 0;
    var dons = Donations.find({goalId: this._id}).fetch();
    for( var i = 0; i < dons.length; i++){
      amt += parseInt(dons[i].amount);
    }
    return parseFloat(amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3);
  },
  firstEdit : function(){
    return Session.get('firstEdit');
  },
  shouldShowPhoto : function(){
    return !Session.get('firstEdit') || this.photoURL != undefined;
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
//        charity: $('input#charity').val().trim(),
        whyGoal: $('textarea#whyGoal').val().trim(),
        whyCharity: $('textarea#whyCharity').val().trim(),
//        photoURL: $('input#photoURL').val().trim(),
        videoEmbed: $('input#videoEmbed').val().trim()
      }
    });
    alert("Changes Saved");
  },
  'click #makeupdate': function(e){
    var gid = this._id;
    var msg = $('#update-msg').val().trim();
    if(msg == "") {
      $('#update-msg').css('border-color','red');
      setTimeout(function(){
        $('#update-msg').attr('style','');
      }, 444);
      return;
    }
    if (Session.get('fileData') == undefined) {
      Meteor.call("makeUpdate", "", {
        _id: gid,
        msg: msg
      });
    }
    Meteor.call("S3upload",Session.get('fileData'),{
      _id: gid,
      msg: msg
    }, "makeUpdate");

    alert('Update posted!');
    window.location.pathname = window.location.pathname.slice(0,-5);
  },
  'change input#updatePhoto' : function(e){
    var files = e.currentTarget.files;
    _.each(files,function(file){
      var reader = new FileReader;
      var fileData = {
        name:file.name,
        size:file.size,
        type:file.type
      };

      reader.onload = function () {
        fileData.data = new Uint8Array(reader.result);
        Session.set('fileData',fileData);
      };

      reader.readAsArrayBuffer(file);
    });
  },
  'click .complete-goal-btn': function(e){
    Meteor.call('winGoal', this._id);
    $('#emailModal2').modal('show');
  },
  'click #share-link': function(e){
    if(Session.get('link-shown')){
      Session.set('link-shown', undefined);
      $('#view-link').hide();
    } else {
      Session.set('link-shown', true);
      $('#view-link').show();
      selectText('view-link');
    }
  },
  'click #delete-goal' : function(e){
    var msg = "Are you sure you want to PERMANENTLY delete your goal?";
    if (confirm(msg)){
      Goals.remove(this._id);
      window.location.pathname = "/";
    }
  },
  'click #add-emails' : function(e){
    Meteor.call('sendEmail', this._id, $('#email-list').val().trim());
    $('#email-list').val('');
  },
  'click #send-email' : function(e){
    Meteor.call('sendEmail2', this._id, $('#email-body').val().trim());
    $('#email-body').val('');
  }
});

Template.editGoal.rendered = function(){
  $('input#deadline').datepicker();
};
