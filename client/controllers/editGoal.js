Template.editGoal.events({
  'click' : function(e){
    var item = $(e.currentTarget);
    var name = e.currentTarget.nodeName;
    if(item.hasClass("editing")){
      name = item.attr("data-return");
      item.replaceWith("<"+name+">"+item.val().trim()+"</"+name+">");
    } else {
      item.replaceWith("<input class='editing' type='text' value='"+item.text().trim()+"' data-return='"+name+"'/>");
    }
  }
});
