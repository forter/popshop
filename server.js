'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const request = require('request-promise-native')

function getForterToken(req) {
  // TODO: impelement
  // see http://expressjs.com/en/api.html#req.cookies
  return req.cookies.forterToken;
  //return "12f3713e5a96452d8275dd32a3c1f0f9_1517265369455__UDF4_6"
}

function createAuth() {
  // TODO: implement
  // see https://github.com/request/request#http-authentication
    return {
        'authorization': "Basic NTNlZDA3ODQxYzNhZGQ5MzJkYzc4MzY2MWQ1NTA0OWIwM2ZjOGJlZjo"
    }
  //return { "Authorization" : "Basic NTNlZDA3ODQxYzNhZGQ5MzJkYzc4MzY2MWQ1NTA0OWIwM2ZjOGJlZjo"}
}

function createHeaders() {
    return {
        "api-version" :"2.0",
        "x-forter-siteid" :"1bcba666be1d",
        "Authorization" : "Basic NTNlZDA3ODQxYzNhZGQ5MzJkYzc4MzY2MWQ1NTA0OWIwM2ZjOGJlZjo",
        "Content-Type" :"text/plain"
    }
}

function createOrder(id, forterToken, inputs) {
    console.log(inputs)
  // TODO: impelement
  // Use the request body from step 1
  return {
    "timeSentToForter": 1505891562000,
    "checkoutTime": 1505891562,
    "connectionInformation": {
      "customerIP": "10.0.0.127",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36",
      "forterTokenCookie": forterToken,
      //forterTokenCookie for later: "2315688945984"
    },
    "orderId": id,
    //existing order id "ps5942"
    "totalAmount": {
      "amountUSD": "12.55"
    },
    "orderType": "WEB",
    "cartItems": [
      {
        "basicItemData": {
          "name": "Cheeseburger",
          "quantity": 1,
          "type": "TANGIBLE",
          "price": {
            "amountUSD": "12.55"
          },
          "productId": "CZB1",
          "category": "Beef"
        },
        "itemSpecificData": {
          "food": {
            "restaurantAddress": {
              "country": "US",
              "address1": "235 Montgomery st.",
              "address2": "Ste. 1110",
              "zip": "94104",
              "region": "CA",
              "city": "San Francisco"
            },
            "tipAmount": {"amountUSD": "1.45"}
          }
        }
      }
    ],
    "payment": [
      {
        "billingDetails": {
          "personalDetails": {
            "firstName": "John",
            "lastName": "Smith"
          },
          "phone": [{
            "phone": "15557654321"
          }]
        },
        "creditCard": {
          "nameOnCard": "John R. H. Smith",
          "bin": "424242",
          "lastFourDigits": "4242",
          "expirationMonth": "03",
          "expirationYear": "2018",
          "verificationResults": {
            "avsFullResult": "Y",
            "cvvResult": "M",
            "authorizationCode": "A33244",
            "processorResponseCode": "0",
            "processorResponseText": ""
          },
          "cardType": "CREDIT",
          "countryOfIssuance": "US",
          "fingerprint": "Mq8EHVEUS7FJxL5s",
          "cardBank": "Chase",
          "cardBrand": "VISA",
          "paymentGatewayData": {
            "gatewayName": "Braintree",
            "gatewayTransactionId": "fjdsS46sdklFd20"
          }
        },
        "defaultPaymentMethod": true
      }
    ],
    "accountOwner": {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john_s@test.com",
      "created": 1415273168,
      "pastOrdersCount": 51,
      "pastOrdersSum": 1702.5,
      "registrationIP": "203.12.55.12"
    },
    "totalDiscount": {
      "couponCodeUsed": "THANKSGIVING",
      "discountType": "COUPON"
    }
  }
}



async function sendToForter(forterToken, inputs) {
  const id = "ps5942"
  const auth = createAuth()
  const headers = createHeaders()
  const json = createOrder(id, forterToken, inputs)
  console.log({auth, headers, json})
  const {action} = await request.post(`https://api.forter-secure.com/v2/orders/${id}`, {auth, headers, json})
  return action
}

const app = express()
app.use(cookieParser())
app.use(express.static('static'))
app.post('/order', multer().none(), async (req, res) => {
  try {
    const forterToken = getForterToken(req)
    const decision = await sendToForter(forterToken, req.body)
    res.json({status: 'success', decision})
  } catch (err) {
    console.error('error: %s', err.message)
    res.json({status: 'error'})
  }
})

app.listen(8080, () => {
  console.log('listening on port 8080')
})
