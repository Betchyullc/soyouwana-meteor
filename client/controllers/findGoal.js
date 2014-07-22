Template.findGoal.helpers({
  goals : function(){
    if ($('.search').val() == ''){
      return Goals.find({}).fetch();  
    } else if ($('.search').val() != undefined) {
      return Goals.find({goal: {$regex: $('.search').val(), $options: 'i'}}).fetch();
    }
  }
});
