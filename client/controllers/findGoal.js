Template.findGoal.helpers({
  goals : function(){
    var s = Session.get('search');
    if (s == '' || s == undefined){
      return Goals.find({}).fetch();  
    } else if (s != undefined) {
      return Goals.find({goal: {$regex: s, $options: 'i'}}).fetch();
    }
  },
  ownerName : function(){
    var u = Meteor.users.findOne(this.owner)
    if (u)
      return u.profile.name;
    else
      return "";
  }
});
