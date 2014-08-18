Template.charity.events({
  'keypress input' : function(e){
    var val = $('.goal-bar input').val() + String.fromCharCode(e.keyCode);
    val = val.toLowerCase();
    if (val.length < 2)
      return;
    $('#fgResultsLoader').show();
    if(e.keyCode == 8) {
//      val = $('input').val();
      console.log(e.keyCode);
    }
    if(Session.get('fg_timeout')){
      clearTimeout(Session.get('fg_timeout'));
    }
    var t = setTimeout(function(){
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
            html += "<li data-uuid='"+data.payload[i].organization_uuid+"'>"+data.payload[i].organization_name+"</li>";
          }
          html += "</ul>";

          $('#fgResultsLoader').hide();//hide the loading anim

          $('.charity-list').remove();
          $('.box').append(html);
        },
        error: function(error) {
          console.log(error);
        }
      });
    }, 303);
    Session.set('fg_timeout',t);
  },
  'click li': function(e){
//    console.log(e);
    $('.goal-bar input').val(e.currentTarget.textContent);
    Session.set('charity_uuid', $(e.currentTarget).data("uuid"));
  }
});
