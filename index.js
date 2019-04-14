const datapay = require('datapay')
const express = require('express')
const RpcClient = require('bitcoind-rpc')
const fs = require('fs')
const ip = require('ip')
const keyfile = fs.readFileSync(process.cwd() + '/.env', 'utf8')
const KEYS = keyfile.split(/[\n\r]+/).filter(function(i) {
  return i
}).map(function(i) {
  let o = {}
  o.key = i.split("=")[0];
  o.val = i.split("=")[1];
  return o
})
var KEY_MAPPING = {}
KEYS.forEach(function(k) {
  KEY_MAPPING[k.key] = k.val
})
const PRIVATE_KEYS = KEYS.filter(function(p) {
  try {
    datapay.bsv.PrivateKey.fromWIF(p.val)
    return p
  } catch (e) {
    // not a key
  }
}).map(function(k) {
  return k.val
})

var app = null
var current_index = 0

var rpc
var start = function(o) {
  var lambda = null
  var port = 8081
  if (o) {
    lambda = o.lambda
    if (o.app) {
      app = o.app
    } else {
      app = express()
    }
    if (o.port) {
      port = o.port
    } else if (KEY_MAPPING.PORT) {
      port = KEY_MAPPING.PORT
    }
  } else {
    lambda = null
    app = express()
  }
  app.use(express.urlencoded({extended: true}));
  app.use(express.json())
  app.use(express.static('public'))
  if (KEY_MAPPING.LOCAL) {
    // rpc
    rpc = new RpcClient({
      'protocol': 'http',
      'user': KEY_MAPPING.rpc_user ? KEY_MAPPING.rpc_user : 'root',
      'pass': KEY_MAPPING.rpc_pass ? KEY_MAPPING.rpc_pass : 'bitcoin',
      'host': KEY_MAPPING.host ? KEY_MAPPING.host : ip.address(),
      'port': '8332',
      'limit': 15
    })
  } else {
    // use remote insight
  }
  app.get('/', function (req, res) {
    res.send('Hello Bitpipe!\n\nMake a POST request to:' + req.protocol + "://" + req.headers.host + req.originalUrl + "/bitpipe with a datapay payload.\n\nMore at https://github.com/unwriter/datapay")
  })
  app.post('/bitpipe', function (req, res) {
    // "tx" is Always treated as signed
    let signed = req.body.tx ? true : false
    let payload = req.body
    if (!signed) {
      if (!PRIVATE_KEYS || PRIVATE_KEYS.length === 0) {
        console.log("Please add private keys to .env file")
        console.log("Example:\n")
        console.log("PRIVATEKEY1=17HTwz6MnLoFCHad3M4Z8dC9XZAHMW4YPm")
        console.log("PRIVATEKEY2=1AatAGkeVN9RFk8qqrmg8BmFiyouHuMsgY")
        res.json({success: false, message: "The server doesn't have a signer key"})
        return
      }
    }
    current_index = (current_index < PRIVATE_KEYS.length-1 ? current_index+1 : 0) // shuffle through
    if (lambda) {
      lambda(req, payload, function(err, transformed) {
        run(err, transformed, res)
      })
    } else {
      run(null, payload, res)
    }
  })
  if (o && o.onconnect) {
    app.listen(port, o.onconnect)
  } else {
    app.listen(port)
  }
}
var run = function(err, payload, res) {
  let current_key = PRIVATE_KEYS[current_index]
  if (err) {
    console.log("Error", err)
  } else {
    if (payload.pay) {
      payload.pay.key = current_key
    } else {
      payload.pay = { key : current_key }
    }
    if (KEY_MAPPING.DEBUG) console.log('payload = ', payload)
    if (KEY_MAPPING.LOCAL) {
      datapay.build(payload, function(err, signed_tx) {
        if (KEY_MAPPING.DEBUG) console.log("signed tx = ", signed_tx)
        rpc.sendRawTransaction(signed_tx, function(err, r) {
          if (err) {
            console.log("error: ", err)
            res.json({success: false, message: err.toString()})
          } else {
            if  (KEY_MAPPING.DEBUG) console.log("success: ", r)
            res.json({success: true, r: r})
          }
        })
      })
    } else {
      datapay.send(payload, function(e, r) {
        if (e) {
          console.log("error: ", e)
          res.json({success: false, message: e.toString()})
        } else {
          if  (KEY_MAPPING.DEBUG) console.log("success: ", r)
          res.json({success: true, r: r})
        }
      })
    }
  }
}
if (require.main === module) {
  start()
} else {
  module.exports = { start: start }
}
