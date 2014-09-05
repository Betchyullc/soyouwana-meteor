S3.config = {
  key: 'AKIAIXKSTBAIP4UDT64Q',
  secret: '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',
  bucket: 'doyouwana'
};
process.env.MAIL_URL="smtp://adamb@reachrr.com:Magmos44@smtp.gmail.com:465/";
FG = {};
FG.endpoint = "http://usapisandbox.fgdev.net/"; //"https://api.firstgiving.com/"
FG.key = "83da2428-384d-4b73-b5fd-978bf5b5e043";
FG.token = "46c39cdb-d37e-48b0-8b86-610d8ddff29c";
FG.localIp = "192.168.0.34";

Meteor.startup(function(){

  Meteor.setInterval(function(){
    Goals.remove({owner: null,  created_at: {$lt: (Date.now()-180000)}}); // remove orphaned goals
  }, 1000*60*60*3);// every 3 hours
});
