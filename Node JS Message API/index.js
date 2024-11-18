const express = require('express');
const request       = require('request');
const crypto        = require("crypto");
/*const dialogflow = require("@google-cloud/dialogflow");*/
const fs            = require('fs');
const Buffer = require('buffer').Buffer;
const QRCode = require('qrcode');
const base64Img = require('base64-img');
const line = require('@line/bot-sdk');
var deeplink = require('node-deeplink');
const bodyParser = require('body-parser');
const open = require('open');
const liff = require("@line/liff");
const window = require("os");
const uuid2 = require('uuid');

// Import the service function and various response classes
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
} = require('actions-on-google');

// variable
const app = dialogflow({
    debug: true
});

var uuid = crypto.randomUUID();
var token = "";
var amount = 2000;
var link = "";
var qr = "";
var image;
let apikey = "l7c968392fb6fc4d5dafa08fa406d80cf1";
let secret = "d7d5fd9ed3a8403f9fd32b78e9b2bbfd";
let mainurl = "https://api-sandbox.partners.scb/partners/sandbox";
let content = "application/json";
let owner = '02326ae3-9233-4032-9c27-6f83372b8629';
let linklogin = "";
const sourcePayload = "";
let userid = "";
let text = "";
var projectId = 'chatbotv2-altn'

//end variable

// create LINE SDK config from env variables
const config = {
    channelSecret: 'acb552d61752fd0f14a659fe04dbd95e',
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: '9zLPdXZIxiyOkhX5rzE+w5BQRLWd4dx/OkklQPoqCw5cWAk4FgOvGEuMPf45d0Lthggm+TNPhRIg2otPwn2yTBsHz5kJId19VXxLMxxHHwu6cTlujPM4rz6cmEhZoOyMbi5P2mlun8ixnDstCJdLMQdB04t89/1O/w1cDnyilFU='
});

line.middleware({
    channelSecret: 'acb552d61752fd0f14a659fe04dbd95e'
});

 var options = {
        method: 'POST',
        url: mainurl + '/v1/oauth/token',
        headers: {
            'resourceOwnerId': owner,
            'requestUId' : uuid,
            'Content-Type' : content
        },
        body: {
            'applicationKey': apikey,
            'applicationSecret': secret
        },
        json: true
};

var optionslogin = {
    method: 'GET',
    url: mainurl + '/v2/oauth/authorize',
    headers: {
        'apikey': apikey,
        'apisecret': secret,
        'resourceOwnerId': owner,
        'requestUId': uuid,
        'response-channel': 'mobile',
        'endState': 'mobile_app',
        'accept-language': 'EN',
        'grant_type':'client_credentials'
    },
    json: true
};

const ex = express();
// parse various different custom JSON types as JSON
ex.use(bodyParser.json({ type: 'application/*+json' }));

// listen on port
// use express
const port = process.env.PORT || 3000;



//app.use( express.json() );

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//intent
app.intent('Default Welcome Intent', (conv,parms) => {
    console.log("####################################### log from intent ########################################");
    // conv.ask(`How are you, ${params.name}?`);
    const sessionId = uuid;

    // Imports the Dialogflow library
    //const { IntentsClient } = require('@google-cloud/dialogflow').v2;

    //// Instantiates a client
    //const dialogflowClient = new IntentsClient();
    //const name = 'projects/chatbotv2-altn/agent/intents/d6839a1e-64b7-4f4f-8719-4516455d99da';
    //async function callGetIntent() {
    //    // Construct request
    //    const request = {
    //        name,
    //    };

    //    // Run request
    //    const response = await dialogflowClient.getIntent(request);
    //    console.log("#################################### Response : " + response + "####################################");
    //}

    //callGetIntent();
    // [END dialogflow_v2_generated_Intents_GetIntent_async]

    //let u = JSON.stringify(req.body.originalDetectIntentRequest.payload.data.source.userId); // Get user ID OK
    //userid = JSON.parse(u);
    //console.log("user ID " + userid);

    //request.get(optionslogin, (err, res, body) => {
    //    if (err) {
    //        return console.log("error from login : " + err);
    //    }
    //    console.log(`Status from login : ${res.statusCode}`);

    //    var d4 = body.data.callbackUrl;
    //    linklogin = d4;
    //    console.log('data from login : ' + linklogin);

    //    // get token
    //    request.post(options, (err, res, body) => {
    //        if (err) {
    //            return console.log(err);
    //        }
    //        console.log(`Status: ${res.statusCode}`);
    //        token = body.data.accessToken;
    //        console.log("token : " + token);

    //        var optionsdeeplink = {
    //            method: 'POST',
    //            url: mainurl + '/v3/deeplink/transactions',
    //            headers: {
    //                'resourceOwnerId': owner,
    //                'requestUId': uuid,
    //                'channel': 'scbeasy',
    //                'authorization': 'Bearer ' + token,
    //                'accept-language': 'EN',
    //                'Content-Type': 'application/json'
    //            },
    //            body: {
    //                transactionType: "PURCHASE",
    //                transactionSubType: ["BP", "CCFA"],
    //                sessionValidityPeriod: 60,
    //                sessionValidUntil: "300",
    //                billPayment: {
    //                    paymentAmount: 10000.00,
    //                    accountTo: "050585498586450",
    //                    ref1: "ABCDEFGHIJ1234567890",
    //                    ref2: "ABCDEFGHIJ1234567890",
    //                    ref3: "NZX"
    //                },
    //                "creditCardFullAmount": {
    //                    "merchantId": "332197459074175",
    //                    "terminalId": "942204000110402",
    //                    "orderReference": "AA100001",
    //                    "paymentAmount": 10000.00
    //                },
    //                "merchantMetaData": {
    //                    "callbackUrl": "//login/18f2df5d-62a0-4bd2-8cd5-afd353268354",
    //                    "merchantInfo": {
    //                        "name": "SANDBOX MERCHANT NAME"
    //                    }
    //                }
    //            },
    //            json: true
    //        };

    //        // post deeplink
    //        request.post(optionsdeeplink, (err, res, body) => {
    //            if (err) {
    //                return console.log("error from deeplink : " + err);
    //            }
    //            console.log(`Status from deeplink : ${res.statusCode} ${body.status.description}`);
    //            if (res.statusCode == 201) {
    //                link = body.data.deeplinkUrl;
    //                console.log("data : " + link);


    //            }

    //        });

    //        var optionqrcode = {
    //            method: 'POST',
    //            url: mainurl + '/v1/payment/qrcode/create',
    //            headers: {
    //                'resourceOwnerId': owner,
    //                'requestUId': uuid,
    //                'channel': 'scbeasy',
    //                'authorization': 'Bearer ' + token,
    //                'accept-language': 'EN',
    //                'Content-Type': 'application/json'
    //            },
    //            body:
    //            {
    //                "qrType": "PPCS",
    //                "ppType": "BILLERID",
    //                "ppId": "050585498586450",
    //                "amount": "5000.00",
    //                "ref1": "REFERENCE1",
    //                "ref2": "REFERENCE2",
    //                "ref3": "NZX",
    //                "merchantId": "332197459074175",
    //                "terminalId": "942204000110402",
    //                "invoice": "INVOICE",
    //                "csExtExpiryTime": "60"
    //            },
    //            json: true
    //        };

    //        // gen qrcode
    //        request.post(optionqrcode, (err, res, body) => {
    //            if (err) {
    //                return console.log("error from qrcode : " + err);
    //            }
    //            if (res.statusCode == 200) {
    //                qr = body.data.qrRawData;
    //                //console.log("QR Code : " + qr);
    //                //image = body.data.qrImage;
    //                //let buff = new Buffer(image, 'base64');
    //                //text = buff.toString('UTF-8');
    //                //console.log("data image : " + text);

    //                //QRCode.toDataURL(body.data.qrRawData, function (err, url) {
    //                //    if (err) return console.log("error occurred")
    //                //    // console.log(url)
    //                //    qr = url;
    //                //});

    //                // Convert to image file
    //                //base64Img.img(body.data.qrImage, '.', 'image', (err, filepath) => {
    //                //     if (err) throw err;
    //                //   console.log('The file has been saved!');
    //                // });
    //            }

    //        });


    //    });
    //});

    //client.pushMessage({
    //    to: userid,
    //    messages: [
    //        {
    //            "type": "flex",
    //            "altText": "Payment options",
    //            "contents": {
    //                "body": {
    //                    "type": "box",
    //                    "contents": [
    //                        {
    //                            "text": "Payment options",
    //                            "weight": "bold",
    //                            "type": "text",
    //                            "size": "xl"
    //                        },
    //                        {
    //                            "type": "image",
    //                             "url": 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + qr,
    //                            "size": "full"
    //                            //"type": "button",
    //                            //"height": "sm",
    //                            //"style": "link",
    //                            //"action": {
    //                            //    "type": "uri",
    //                            //    "uri": "https://liff.line.me/2006550252-lzOyz80A",
    //                            //    "label": "QR Code"
    //                            //}
    //                        },
    //                        {
    //                            "style": "link",
    //                            "type": "button",
    //                            "action": {
    //                                "label": "SCB Easy",
    //                                "uri": 'https://3bab-184-22-38-186.ngrok-free.app/deeplink?url=' + linklogin,
    //                                "type": "uri"
    //                            },
    //                            "height": "sm"
    //                        }
    //                    ],
    //                    "layout": "vertical"
    //                },
    //                "type": "bubble"
    //            }
    //        }
    //    ]
    //});
    conv.ask('How are you?');
});

//error
app.catch((conv, error) => {
    console.error("Error : " + error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

//fallback
app.fallback((conv) => {
    console.log("Fallback");
    conv.ask(`I couldn't understand. Can you say that again?`);
});

//  ############################### start server ###############################
ex.listen(port, () => {
    console.log(`Node.js server started on port ${port}`);
});

// use dialogflow
//ex.use(bodyParser.json(), app).listen(port, () => {
//    console.log(`Node.js server started on port ${port}`);
//});

// receive message from line
ex.post('/', jsonParser, (req, res) => {

  
    console.log('received webhook', JSON.stringify(req.body));

    // post login
    request.get(optionslogin, (err, res, body) => {
        if (err) {
            return console.log("error from login : " + err);
        }
        console.log(`Status from login : ${res.statusCode}`);
        
        var d4 = body.data.callbackUrl;
        linklogin = d4;
        console.log('data from login : ' + linklogin);

     // get token
     request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        token = body.data.accessToken;
        console.log("token : " + token);



        var optionsdeeplink = {
            method: 'POST',
            url: mainurl + '/v3/deeplink/transactions',
            headers: {
                'resourceOwnerId': owner,
                'requestUId': uuid,
                'channel': 'scbeasy',
                'authorization': 'Bearer ' + token,
                'accept-language': 'EN',
                'Content-Type': 'application/json'
            },
            body: {
                transactionType: "PURCHASE",
                transactionSubType: ["BP", "CCFA"],
                sessionValidityPeriod: 60,
                sessionValidUntil: "300",
                billPayment: {
                    paymentAmount: 10000.00,
                    accountTo: "050585498586450",
                    ref1: "ABCDEFGHIJ1234567890",
                    ref2: "ABCDEFGHIJ1234567890",
                    ref3: "NZX"
                },
                "creditCardFullAmount": {
                    "merchantId": "332197459074175",
                    "terminalId": "942204000110402",
                    "orderReference": "AA100001",
                    "paymentAmount": 10000.00
                },
                "merchantMetaData": {
                    "callbackUrl": "//login/18f2df5d-62a0-4bd2-8cd5-afd353268354",
                    "merchantInfo": {
                        "name": "SANDBOX MERCHANT NAME"
                    }
                }
            },
            json: true
        };

            // post deeplink
            request.post(optionsdeeplink, (err, res, body) => {
                if (err) {
                    return console.log("error from deeplink : " + err);
                }
                console.log(`Status from deeplink : ${res.statusCode} ${body.status.description}`);
                if (res.statusCode == 201) {
                    link = body.data.deeplinkUrl;
                    console.log("data : " + link);
                }

            });

            var optionqrcode = {
                method: 'POST',
                url: mainurl + '/v1/payment/qrcode/create',
                headers: {
                    'resourceOwnerId': owner,
                    'requestUId': uuid,
                    'channel': 'scbeasy',
                    'authorization': 'Bearer ' + token,
                    'accept-language': 'EN',
                    'Content-Type': 'application/json'
                },
                body:
                {
                    "qrType": "PPCS",
                    "ppType": "BILLERID",
                    "ppId": "050585498586450",
                    "amount": "5000.00",
                    "ref1": "REFERENCE1",
                    "ref2": "REFERENCE2",
                    "ref3": "NZX",
                    "merchantId": "332197459074175",
                    "terminalId": "942204000110402",
                    "invoice": "INVOICE",
                    "csExtExpiryTime": "60"
                },
                json: true
            };

            // gen qrcode
            request.post(optionqrcode, (err, res, body) => {
                if (err) {
                    return console.log("error from qrcode : " + err);
                }
                if (res.statusCode == 200) {
                    qr = body.data.qrRawData;
                    //console.log("QR Code : " + qr);
                    //image = body.data.qrImage;
                    //let buff = new Buffer(image, 'base64');
                    //text = buff.toString('UTF-8');
                    //console.log("data image : " + text);

                    //QRCode.toDataURL(body.data.qrRawData, function (err, url) {
                    //    if (err) return console.log("error occurred")
                    //    // console.log(url)
                    //    qr = url;
                    //});

                    // Convert to image file
                    //base64Img.img(body.data.qrImage, '.', 'image', (err, filepath) => {
                    //     if (err) throw err;
                    //   console.log('The file has been saved!');
                    // });
                }
            });
        });
    });

    
    req.body.events; // webhook event objects from LINE Platform
    let u = JSON.stringify(req.body.originalDetectIntentRequest.payload.data.source.userId); // Get user ID OK
    userid = JSON.parse(u);
    console.log("user ID " + userid);

    const sessionId = uuid2.v4();

    var query = JSON.stringify(req.body.queryResult.fulfillmentMessages[0]);
    var q = JSON.parse(query);
    console.log("query : " + q);
    
    client.pushMessage({
        to: userid,
        messages: [
            {
                "type": "flex",
                "altText": "Payment options",
                "contents": {
                    "body": {
                        "type": "box",
                        "contents": [
                            {
                                "text": "Payment options",
                                "weight": "bold",
                                "type": "text",
                                "size": "xl"
                            },
                            {
                                "type": "image",
                                 "url": 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + qr,
                                "size": "full"
                                //"type": "button",
                                //"height": "sm",
                                //"style": "link",
                                //"action": {
                                //    "type": "uri",
                                //    "uri": "https://liff.line.me/2006550252-lzOyz80A",
                                //    "label": "QR Code"
                                //}
                            },
                            {
                                "style": "link",
                                "type": "button",
                                "action": {
                                    "label": "SCB Easy",
                                    "uri": 'https://3bab-184-22-38-186.ngrok-free.app/deeplink?url=' + linklogin,
                                    "type": "uri"
                                },
                                "height": "sm"
                            }
                        ],
                        "layout": "vertical"
                    },
                    "type": "bubble"
                }
            }
        ]
    });

   // open.openApp(linklogin);
    //const result2 = { "text": { "text": [linklogin] } };
    //return res.send({ fulfillmentMessages: [result2] });

    // res.location(linklogin);
    // res.send(linklogin);
   // open.open(linklogin, { app: { name: 'scbeasysim' } });
    
});


// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    // create an echoing text message
    const echo = { type: 'text', text: event.message.text };

    // use reply API
    return client.replyMessage({
        replyToken: event.replyToken,
        messages: [echo],
    });
}

ex.post('/login', jsonParser, (req, res) => {
    console.log("login success");
    console.log('received Confirm ', req.body);
});

// get response from SCB confirm payment
ex.post('/confirmpayment', jsonParser, (req, res) => {
    console.log("#################### confirm payment from SCB #############################");
    console.log('received Confirm ', req.body);
});







