Template.deadline.events({
  'keypress input':function(e){
//    console.log(e.keyCode);
    if(e.keyCode <= 57 && e.keyCode >= 47
      || (e.keyCode == 191 || e.keyCode == 111)){
      // do nothing, the character is allowed
    } else {
      e.preventDefault();
    }
  }
});
