Template.donate.events({
  'click button': function(){
    Donations.insert({
      amount: $('.amount').val(),
      goalId: this._id
    });
  }
});