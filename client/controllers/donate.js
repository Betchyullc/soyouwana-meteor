var typeFromNumber = function(number){
  return "VI";
}
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
    e.preventDefault();
    //error checking/form validation
    var amt = $('.amount').val();
    if (amt == "" || Session.get('submitted-donation')) {
    } else {
      Session.set('submitted-donation', true);
      $('.submit-btn').attr("disabled", "disabled");
      var name = $('#donate-name').val().trim() || "Anonymous";
      var cardData = {
        number : $('#credit-card-number').val().trim(),
        expiration : $('#expiration').val().trim(),
        cvv : $('#cvv').val().trim(),
        first: $('#first-name').val().trim(),
        last: $('#last-name').val().trim(),
        addr: $('#address').val().trim().replace(/ /g,"+"),
        city: $('#city').val().trim().replace(/ /g,"+"),
        state: $('#state').val().trim().toUpperCase(),
        email: $('#email').val().trim().replace("@", "%40"),
        zip: $('#zip-code').val().trim(),
        amount: $('#amount').val()
      };
      cardData.cardType = typeFromNumber(cardData.number);
      Meteor.call('donate', cardData, function(err,res){
        console.log(res);
        Donations.insert({
          amount: cardData.amount,
          goalId: $('#goal-id').text(),
          name: name,
          msg: $('#donate-msg').val().trim(),
          created_at: Date.now(),
          submitted: false,
          customer: res[0].cardOnFileId[0],
          email: $('#email').val().trim()
        }, function(err, id){
          alert('Your donation has been processed. You will be charged only if the goal owner indicates that they completed the goal.');
          window.location.pathname = '/goal/' + $('#goal-id').text();
        });
      });
    
    }
  }
});
