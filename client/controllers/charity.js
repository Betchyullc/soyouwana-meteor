Template.charity.events({
  'keypress input' : function(e){
    var val = $('.goal-bar input').val() + String.fromCharCode(e.keyCode);
    val = val.toLowerCase();
    if (val.length < 5)
      return;
    if(e.keyCode == 8) {
//      val = $('input').val();
      console.log(e.keyCode);
    }
    var params = {
      q: 'organization_name:*'+val+'*', 
    };
    $.ajax({
      dataType: 'jsonp',
      contentType: 'application/json',
      data: params,
      jsonp: 'jsonpfunc',
      url: 'http://graphapi.firstgiving.com/v1/list/organization?jsonpfunc=?',
      success: function(data) {
        var html = "<ul class='charity-list'>";

        for(var i = 0; i < data.payload.length; i++){
          html += "<li>"+data.payload[i].organization_name+"</li>";
        }
        html += "</ul>";

        $('.charity-list').remove();
        $('.box').append(html);
      },
      error: function(error) {
      }

    });
  },
  'click li': function(e){
//    console.log(e);
    $('.goal-bar input').val(e.currentTarget.textContent);
  }
});
