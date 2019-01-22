/*
You can filter this transaction with the following bitquery:
{
  "v": 3,
  "q": {
    "find": {
      "out.b0": { "op": 106 },
      "out.b1": { "op": 0 }
    }
  }
}
*/
var axios = require('axios')
const host = "https://pipe.bitdb.network"
var datapay = require('datapay')
axios.post(host + "/bitpipe", {
  data: [ "", "Hello from Bitpipe"]
})
.then(function(response) {
  console.log("response = ", response)
})
.catch(function(e) {
  console.log("Error = ", e)
})
