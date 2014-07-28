Template.donate.events({
  'click button': function(){
    Donations.insert({
      amount: $('.amount').val(),
      goalId: this._id,
      name: $('.donate-name').val().trim(),
      msg: $('.donate-msg').val().trim(),
      created_at: Date.now()
    });
  }
});
