//chain sdk parts
//const chain = require('chain-sdk')
var bodyParser = require('body-parser');
const connection = {
      port: 7206,     //rpc port
      host: '220.230.112.30',
      pass: "9WBL5xWD1nRkcRyLWw6arcv3ToVRDPt9F8n51DfWMLPo",
//      host: '127.0.0.1',
//      pass: "973MVcjrxbwyKdCWN6mMeCKUXZGRXgAFB4g4xr3PkcME"
      user: "multichainrpc",
//    port: 6601,
//    host: '127.0.0.1',
//    user: "test",
//    pass: "test"
}

const assert = require('assert');
//module.exports = require("multichain-node");
const bluebird = require("bluebird");
const multichain = bluebird.promisifyAll(require("multichain-node")(connection), {suffix: "Promise"});


module.exports = function(app, fs, jsonParser, urlencodedParser, client_token_arg ,address_param )
{
//  const client = new chain.Client(address_param,client_token_arg);

// XMLHttpRequest communication
app.post('/createAddressPrivateKey/:IDname',function(req,res){
      var sess = req.session;
      var IDofUser = req.params.IDname;
      var result = {};

      // CHECK REQ VALIDITY
      if(!req.body.password || !req.body.IDname){
      //     if(!req.body["password"] || !req.body["name"]){
          result["success"] = 0;
          result["error"] = "invalid request";
          res.json(result);
          return;
      }

      // LOAD DATA & CHECK DUPLICATION
      fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
          var users = JSON.parse(data);
          if(users[IDofUser]){
              // DUPLICATION FOUND
              result["success"] = 0;
              result["error"] = "duplicate";
              res.json(result);
              return;
          }
          // ADD TO DATA
          users[IDofUser] =  req.body;

          // SAVE DATA
          fs.writeFile(__dirname + "/../data/user.json",
                       JSON.stringify(users, null, '\t'), "utf8", function(err, data){
      //             result = {"success": 1};
      //             res.json(result);
/*              res.render('choice', {
                  title: "MY HOMEPAGE",
                  length: 5,
                  IDname: req.body.IDname
              })
*/
          })
      })

      console.log("Running Tests")


      multichain.getInfo((err, info) => {
          if(err){
            console.log(err);
              throw err;
          }
          console.log(info);
      })

  });

  // XMLHttpRequest communication
  app.post('/checkID/:IDname', function(req, res){

     var result = {  };
     var IDname = req.params.IDname;


     // CHECK REQ VALIDITY
     if(!req.params.IDname){
  //     if(!req.body["password"] || !req.body["name"]){
         result["success"] = 0;
         result["error"] = "invalid request";
         res.json(result);
         return;
     }

     // LOAD DATA & CHECK DUPLICATION
     fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
         var users = JSON.parse(data);
         if(users[IDname]){
             // DUPLICATION FOUND
             result["success"] = 0;
             result["error"] = "duplicate";
         }else {
             result["success"] = 1;
         }
         res.json(result);
     })
  });

  app.get('/',urlencodedParser,function(req,res){
      var sess = req.session;

      res.render('index', {
          title: "인덱스화면",
          length: 5,
          IDname: sess.IDname
      })
  });

  app.get('/enroll/:lang',function(req,res){
      var sess = req.session;

//      console.log("xptmxmxm")

      res.render('enroll', {
          title: "Enrollment",
          length: 5,
          IDname: sess.IDname,
          lang: req.params.lang
      })
  });

}
