Template.facebook.loc = function(){
  return window.location.href;
};
Template.twitter.loc = Template.facebook.loc;
Template.fbSmall.loc = Template.facebook.loc;

var onclick = function(e){
  e.preventDefault();
  var width  = 575,
      height = 400,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      url    = e.currentTarget.href,
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  window.open(url, 'twitter', opts);

  return false;
};

Template.facebook.events({ 'click a': onclick });
Template.twitter.events({ 'click a': onclick });
Template.fbSmall.events({ 'click a': onclick });
