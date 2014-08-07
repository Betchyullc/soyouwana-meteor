Template.donate.helpers({
  goal : function(){
    var g = Goals.findOne(this._id);
    if (g) {
      return g.goal;
    }
    return "";
  },
  deadline : function(){
    var g = Goals.findOne(this._id);
    if (g) {
      return g.deadline;
    }
    return "";
  },
  charity : function(){
    var g = Goals.findOne(this._id);
    if (g) {
      return g.charity;
    }
    return "";
  }
});
Template.donate.events({
  'click .submit-btn': function(e){
    var amt = $('.amount').val();
    if (amt == "") {
      e.preventDefault();
    } else {
    }
  }
});

Template.donate.rendered = function(){
  Meteor.call('clientToken', function(err, res){
    if( err) return;
    $('#dropin').text(""); // clear the 'loading form...'
    braintree.setup(res.result, 'dropin', {
      container: 'dropin',
      paymentMethodNonceReceived: function (event, nonce) {
        var name = $('#donate-name').val().trim();
        Meteor.call('donate', nonce, name, function(err,res){
          console.log(err);
          console.log(res);
          Donations.insert({
            amount: $('#amount').val(),
            goalId: $('#goal-id').text(),
            name: name,
            msg: $('#donate-msg').val().trim(),
            created_at: Date.now(),
            submitted: false,
            customer: res.result.customer.id
          }, function(err, id){
            alert('Your donation has been processed. You will be charged only if the goal owner indicates that they completed the goal.');
            window.location.pathname = '/goal/' + $('#goal-id').text();
          });
        });
      }
    });
  });
};
