"use strict";


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
//      let addressMy, pubkeyMy, privkeyMy;

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
          fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), "utf8", function(err, data){
            if(err){
                throw err;
            }

            console.log("call createkeypairs()");
//        return multichain.validateAddressPromise({address: this.address1})
            multichain.createkeypairsPromise().then(addrPubPri => {
                assert(addrPubPri);
                console.log(addrPubPri);
/*
                this.addressMy = addrPubPri[0]["address"];
                this.pubkeyMy = addrPubPri[0]["pubkey"];
                this.privkeyMy = addrPubPri[0]["privkey"];

*/
                result["address"] = addrPubPri[0]["address"];
                result["pubkey"] = addrPubPri[0]["pubkey"];
                result["privkey"] = addrPubPri[0]["privkey"];

//                console.log("addrPubPri.address : " + addrPubPri.address);
                console.log("addrPubPri[address] : " + addrPubPri[0]["address"]);
                console.log("this.addressMy : " + result["address"]);
//                res.json(result);
//                importAddress: ["address", {"label": ""}, {"rescan": true}],
                return multichain.importAddressPromise({
                  address: result["address"],
                  rescan: false
                })
            })
            .then(() => {
    //            assert(privateKey)

                console.log("TEST: GRANT")
                return multichain.grantPromise({
                    addresses: result["address"],
                    permissions: "send,receive,issue,admin"
                })
            })
            .then(() => {
                console.log("TEST: ISSUE")
                return multichain.issuePromise({
                    address: result["address"],
                    asset: {
                        name: "bookingcoin",
                        open: true
                    },
                    qty: 1000,      // 기본  100 개  예약할 수 있는 조건 부여
                    units: 1
                })
            })
            .catch(err => {
                console.log(err)
                throw err;
            })

          })   // fs.writeFile
      })  // fs.readFile




/*

      multichain.getNewAddressPromise()
      .then(address => {
          assert(address, "Could not get new address")
          this.address1 = address;

          console.log("TEST: VALIDATE ADDRESS")
          return multichain.validateAddressPromise({address: this.address1})
      })
      .then(addrInfo => {
          assert(addrInfo);
          assert(addrInfo.isvalid === true);
          assert(addrInfo.address === this.address1);

          console.log("TEST: DUMP PRIVATE KEY")
          return multichain.dumpPrivKeyPromise({address: this.address1})
      })
      .then(privateKey => {
          assert(privateKey)

          console.log("TEST: GRANT")
          return multichain.grantPromise({
              addresses: this.address1,
              permissions: "send,receive,issue,admin"
          })
      })
      .then(permissionsTxid => {
          assert(permissionsTxid)

          console.log("TEST: GET NEW ADDRESS")
          return multichain.getNewAddressPromise();
      })
      .catch(err => {
          console.log(err)
          throw err;
      })
  // grant
 grant Myaddress receive,send

// issue
      issue Myaddress asset0 50000 0.001
      issuefrom pppoooo pppoooo '{"name":"GBP","open":true}' 50000 0.01 0 '{"origin":"uk", "stage":"01", "purpose":"parts prepayment"}'
      Metadata-only issuance
      Finally let’s see an example of a reissuance whose sole purpose is to add some metadata to the asset, and not create any new units. This is achieved simply by passing zero for the quantity parameter:

      issuemorefrom pppoooo pppoooo GBP 0 0 '{"approval":"head office"}'

      The metadata-only issuance event can be viewed here:

      listassets GBP true
*/

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
