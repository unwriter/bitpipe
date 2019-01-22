# Bitpipe

> Super simple and flexible Bitcoin transaction broadcast microservice

![pipe](pipe.png)

Bitpipe is a transaction broadcast Microservice powered by [DataPay](https://github.com/unwriter/datapay), a declarative Bitcoin transaction builder and broadcaster library for **Bitcoin SV**.

It sets up a web server that accepts a [Datapay Payload](https://github.com/unwriter/datapay#declarative-programming) that looks like  this:

```
{
  "data": ["0x6d02", "hello from datapay"],
}
```

or,

```
{
  "data": ["0x6d02", "hello from datapay"],
  "pay": {
    "to": [{
      "address": "1A2JN4JAUoKCQ5kA4pHhu4qCqma8jZSU81",
      "value": 1000
    }]
  }
}
```

or,

```
{
  "data": ["0x6d02", "hello from datapay"],
  "pay": {
    "key": "5JZ4RXH4MoXpaUQMcJHo8DxhZtkf5U5VnYd9zZH8BRKZuAbxZEw",
    "rpc": "https://bchsvexplorer.com",
    "fee": 400,
    "to": [{
      "address": "1A2JN4JAUoKCQ5kA4pHhu4qCqma8jZSU81",
      "value": 1000
    }]
  }
}
```

As you can see, **the request payload is self-descriptive of how the transaction should be composed.**

On top of that, you can even **override the payload on the server to create a transforming pipe.**

Thanks to this declarative approoach, the service is extremely flexible. You can pass around transactions as JSON payload, not only between a client an a server, but also among multiple nodes.

For example, here's a scenario:

1. Client composes an unsigned transaction as [a datapay object](https://github.com/unwriter/datapay#declarative-programming)
2. POSTs the datapay object to Bitpipe A as JSON
3. Bitpipe A modifies some data from the datapay object and passes it to Bitpipe B
4. Bitpipe B modifies some data from the datapay object, signs the result with its OWN private key, and broadcasts it to Bitcoin.

This paradigm opens door to all kinds of interoperable Bitcoin microservices, which not only includes servers but also various clients such as Mobile devices, Raspberry Pis, etc.

This is similar to how the [Unix pipeline system](https://en.wikipedia.org/wiki/Pipeline_(Unix)) works.

![unixpipe](unixpipe.png)

To learn more about this concept, see [Fat URI](https://github.com/unwriter/fatURI). DataPay is a basic implementation of the idea (Sans the URI part).



# Features

## 1. Signed Raw Transaction

Most basic feature, you can just submit [a raw transaction datapay object](https://github.com/unwriter/datapay#1-importing-a-transaction-from-exported-hex-string). This is a typical basic feature provided by many Insight APIs. The user signs a transaction with their own key and posts it to an endpoint, and the endpoint broadcasts the raw transaction to the Bitcoin network through its own node.

```
{
  "tx": "01000000014182e9844c2979d973d3e82c55d57e1a971ed2e5473557ce0414864612911aa5010000006b48304502210098f8f32cd532bc73eef1e01c3d359caf0a7aa8f3dc1eebb8011d80810c9dbe66022054c6b23d5bd9573a1e6135c39dcc31a65cab91f3b3db781995e824614e24bad9412102d024c1861ccc655ce3395bc4d8a0bdcfb929ffcd9d1a8c81d8c6fa1dfb9bd70cffffffff020000000000000000106a026d020b68656c6c6f20776f726c64c2ff0000000000001976a9142a3a6886d98776d0197611e5328ba8806c3739db88ac00000000"
}
```

This too, [is a form of datapay object](https://github.com/unwriter/datapay#1-importing-a-transaction-from-exported-hex-string).



## 2. Unsigned Transaction Magic

This is where things get crazy and the declarative Bitpipe (Datapay) approach shines. You can submit an **unsigned** [Datapay JSON object](https://github.com/unwriter/datapay#declarative-programming) to Bitpipe, and the service could do whatever it wants with it before broadcasting.

Here's a quick interesting scenario:

**Step 1.** You set up a website where users can just make a POST request to your Bitpipe endpoint with a datapay object:

```
{
  "data": ["0x6d02", "post to memo.cash!"]
}
```

**Step 2.** Users visit and keep using (for free)

In the backend, **it is YOU who pay for the transactions through Bitpipe.** You sign the incoming [datapay object](https://github.com/unwriter/datapay#declarative-programming) with your own Bitcoin key and turn it into a transaction, and **broadcast it for your users, for FREE.**


> You may ask "Why would anyone want to pay for someone else's transaction"? But use your imagination and you'll realize there are many ways to take advantage of this.
>
> 1. Buy attention with money: If you can come up with a business model to subsidize the attention you acquire from your FREE transactions, you can monetize the attention.
> 2. Freemium: You can start by giving away free transactions, but once the user reaches certain threshold you can let THEM pay for it, through wallets such as HandCash, Moneybutton, Cashpay, Pixel Wallet, Centbee, etc.
> 3. Build a community supported Autonomous API: Build an API which is 100% sustained by community donation.


## 3. Bitcoin Lambda

We can't talk about pipes without discussing functional programming. 

Many times you may NOT want to broadcast every single request submitted by the client, especially if you're using your own money to pay for the user transactions. (Filter)

Also, many times you may want to TRANSFORM incoming requests before signing and broadcasting to Bitcoin. (Map)

1. **Filter:** Filter out certain requests and don't broadcast
2. **Map:** Transform the request before broadcasting

Let's go through each:



### A. Filter

![filter](filter.png)

There are many cases you want to filter requests and only the requests that meet your standards go through, before signing the transaction and broadcasting. Examples:

1. **Invalid transactions:** Your application may have a certain purpose, and you probably want to make sure all requests meet certain standards before sending. 
2. **Ban IP:** If YOU are the one subsidizing the transactions, you probably may want certain level of filtering in order to fight against abusers
3. **Filter based on referer:** You may want to limit the requests to come from ONLY your website.
4. **Filter based on transaction patterns:** May want to filter out based on content, such as profanity.

Example code

```
const bitpipe = require('bitpipe')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    if (payload.data[0] != "0x6d02")
      // Reject if it's not a Memo post transaction request
      pipe(new Error("invalid protocol prefix"), null)
    } else {
      pipe(null, payload)
    }
  }
})
```



### B. Map

![map](map.png)

You may want to transform the incoming request before broadcasting. Examples:

1. **Prefix:** If you created an [OP_RETURN powered chatroom](https://bitchat.bitdb.network) and want to prepend a username to the transaction automatically, you can transform the data before broadcasting.
2. **Translate:** You can translate incoming english phrase into chinese before broadcasting
3. **Compute:** You can run some computation on the incoming stream and post to the blockchain. For example the user can upload a large file to your Bitpipe node, you can hash the entire file and post it to the blockchain for authenticity.

```
const bitpipe = require('bitpipe')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    // Prepend payload with "Hello"  
    payload.data[1] = "Hello, " + payload.data[1]
    pipe(null, payload)
  }
})
```



## 4. Multiparty Pipes

We can go deeper. Think about the Unix pipe system. Each process takes an input, does some work with it, and passes the result onto the next process via the ["pipeline system"](https://en.wikipedia.org/wiki/Pipeline_(Unix)).

![unixpipe](unixpipe.png)

Just like this, we can create a swarm of multiple specialized microservices that communicate with one another by passing around signed or unsigned bitcoin transactions.

Let's revisit the example mentioned earlier:

1. Client composes an unsigned transaction as a [datapay object](https://github.com/unwriter/datapay#declarative-programming)
2. POSTs the datapay object to Bitpipe A as JSON
3. Bitpipe A modifies some data from the datapay object and passes it to Bitpipe B
4. Bitpipe B modifies some data from the datapay object, signs the result with its OWN private key, and broadcasts it to Bitcoin.

This whole process resembles the unix pipeline system, and no security is breached along the way, thanks to Bitcoin.


# Modes

There are two modes:

**1. Full Node:** Works with your OWN node, which means you need a Bitcoin node.
**2. Light Node:** Works WITHOUT a Bitcoin node. Instead it uses a remote insight endpoint (Default: bchsvexplorer.com)

By default Bitpipe runs as Light node.

If you want to use your own Bitcoin node instead of a remote Insight API, you can add the following line to the `.env` file:

```
LOCAL=true
```


# Usage

There are two ways you can use Bitpipe:

1. **Standalone:** A basic microservice that propates incoming datapay payloads without modifying or filtering
2. **As a module (Advanced):** Build your own Bitpipe service. You can add your own Lambda function to filter and transform incoming requests before broadcasting.



## 1. Standalone

**Step 1. Download**

```
git clone https://github.com/unwriter/bitpipe.git
```



**Step 2. Setup .env**

Open `.env` file in the root folder and store your private keys (as many as you want);

```
PRIVATE_KEY1=...
PRIVATE_KEY2=...
PRIVATE_KEY3=...
PRIVATE_KEY4=...
```

Bitpipe will shuffle through each key to send transactions out whenever it gets a request.



**Step 3. More configuration**

You can additionally set the `.env` file keys to configure the Bitcoin RPC settings:

- **rpc_user:** Bitcoin JSON-RPC username (default: 'root')
- **rpc_pass:** Bitcoin JSON-RPC password (default: 'bitcoin')
- **host:** Bitcoin JSON-RPC host IP (default: your ip)



**Step 4. Start**

```
npm start
```



**Step 5. Use**

The microservice only has a single endpoint (for now).

```
POST /bitpipe
```

You can pass a [datapay JSON object](https://github.com/unwriter/datapay#declarative-programming) to this endpoint.

If unsigned, this assumes that the microservice itself will sign the transaction and broadcast for the user, thereby making the transaction FREE for the end-user.

You can try sending your transaction to the endpoint like this:

```
curl -X POST https://[BITPIPE_HOST]/bitpipe -H "Content-Type: application/json" -d '{"tx": "[SIGNED_TRANSACTION_STRNG]"}'
```

or

```
curl -X POST https://[BITPIPE_HOST]/bitpipe -H "Content-Type: application/json" -d '{"data": ["0x6d02", "Hello world"]}'
```





## 2. As a Module

You can use Bitpipe as a module. With this you can build your own Bitpipe node.

This will allow you to customize:

- **Filter:** Filter the incoming requests in any way you want
- **Transform:** Transform the incoming request to create one or more new transaction object[s].

First install:

```
npm install --save bitpipe
```

Then we can use it in any app.

Bitpipe has only one method: `start`. The `start` method takes one object argument, whose attributes include:

1. `lamba`: lambda map/filter function
2. `app`: an existing express.js app object
3. `port`: a custom port

```
bitpipe.start({
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    // 1. filter or modify payload
    // 2. pass it to pipe(err, ressponse) function
  },
  app: [Express.js app instance if you want to use an existing app],
  port: [Custom port]
})
```



### A. Filter

```
const bitpipe = require('bitpipe')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    if (payload.data[0] != "0x6d02")
      // Reject if it's not a Memo post transaction request
      pipe(new Error("invalid protocol prefix"), null)
    } else {
      pipe(null, payload)
    }
  }
})
```

### B. Map

```
const bitpipe = require('bitpipe')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    // Prepend payload with "Hello"  
    payload.data[1] = "Hello, " + payload.data[1]
    pipe(null, payload)
  }
})
```



## 3. Use along with an existing Express app

```
var nonce = 0
const bitpipe = require('bitpipe')
const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.get("/", function(req, res) {
  res.json({nonce: nonce})
})
// Pass "app" as the first argument
bitpipe.start({
  app: app,
  lambda: function(req, payload, pipe) {
    /**************************************************
    * 
    * req: express.js request object
    * payload: Datapay payload
    * pipe: callback function to call after map/filter is finished
    *
    **************************************************/
    if (req.body.nonce < nonce) {
      // invalid nonce. reject.
      pipe(new Error("invalid nonce"), null)
    } else {
      // valid nonce. proceed.
      nonce += 1
      pipe(null, payload)
    }
  }
})
app.listen(8081, () => console.log(`bitpipe listening on port ${port}!`))
```

# Demo

Se the demo folder to learn more.

## 1. Default


https://github.com/unwriter/bitpipe/tree/master/demo/default

contains clients that make requests to the default standalone node.

To run these demos,

1. run `npm start` or `node index` from the root path to run the standalone mode
2. run each code to test. These client codes will make a JSON request to the endpoint set up in step 1.


## 2. Lambda

https://github.com/unwriter/bitpipe/tree/master/demo/lambda

Contains examples of various lambda strategies.

All these examples have `client.js` and `server.js`.

The `server.js` is the custom Bitpipe node code as explained in [this section](https://github.com/unwriter/bitpipe#2-as-a-module).

The `client.js` is the code that make the request to the server once it's up.

So to run these examples:

1. start `server.js` first
2. run `client.js`

Here's what each folder contains:

- [filter](https://github.com/unwriter/bitpipe/tree/master/demo/lambda/filter): Filtering requests to only pass through certain patterns. In this case it only filters out `0x6d02` transactions (Memo.cash post)
- [map](https://github.com/unwriter/bitpipe/tree/master/demo/lambda/map): Mapping requests to transform into another format. In this case  it appends a timestamp to the message.
- [hash](https://github.com/unwriter/bitpipe/tree/master/demo/lambda/hash): It's another "map" but this time takes a long text, and transforms it by hashing it, before broadcasting.
