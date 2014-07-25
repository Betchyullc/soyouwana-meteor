Template.charity.events({
  'keypress input' : function(e){
    var val = $('input').val() + String.fromCharCode(e.keyCode);
    val = val.toLowerCase();
    if(e.keyCode == 8) {
//      val = $('input').val();
      console.log(e.keyCode);
    }
    var list = [
      "Clear Lake Bible Church",
      "Doctors without Borders",
      "Engineers without Borders",
      "Society for Prevention of Penis Mishandling"
    ];

    var html = "<ul class='charity-list'>";

    for(var i = 0; i < list.length; i++){
      if (list[i].toLowerCase().indexOf(val) != -1)
        html += "<li>"+list[i]+"</li>";
    }
    html += "</ul>";

    $('.charity-list').remove();
    $('.box').append(html);
  },
  'click li': function(e){
//    console.log(e);
    $('.goal-bar input').val(e.currentTarget.textContent);
  }
});
