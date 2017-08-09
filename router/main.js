//chain sdk parts
//const chain = require('chain-sdk')
var bodyParser = require('body-parser');
//var momentBy = require('moment');
//momentBy().format();
//const client = new chain.Client("http://220.230.112.30:1999","client:8e75bc40f75dcb82e86e852963bb47ad14e8828ce500619151ef302dcb079afc")
//const client = new chain.Client();



module.exports = function(app, fs, jsonParser, urlencodedParser, client_token_arg ,address_param )
{
//  const client = new chain.Client(address_param,client_token_arg);

  app.get('/',urlencodedParser,function(req,res){
      var sess = req.session;

      res.render('index', {
          title: "인덱스화면",
          length: 5,
          IDname: sess.IDname
      })
  });
}
