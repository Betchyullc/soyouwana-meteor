var typeFromNumber = function(number){
  //Check the first two digits first
  switch(parseInt(number.substr(0,2)) ){
    case 34:
    case 37:
      return "AX";
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
      return "MC";
    default:
      //None of the above - so check the
      //first four digits collectively
      switch(parseInt(number.substr(0,4)){
        case 2014:
        case 2149:
          return "ER"
        case 2131, 1800
          return "JB";
        case 6011:
          return "DI";
        default:
          //None of the above - so check the
          //first three digits collectively
          switch(parseInt(number.substr(0,3)){
            case 300:
            case 301:
            case 302:
            case 303:
            case 304:
            case 305:
              return "AD";
            default:
              //None of the above -
              //'so simply check the first digit
              switch(parseInt(number.substr(0,1)){
                case 3:
                  return "JB";
                case 4:
                default:
                  return "VI";
              }
          }
      }
  }
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
