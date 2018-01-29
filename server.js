'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const request = require('request-promise-native')

function getForterToken(req) {
  // TODO: impelement
  // see http://expressjs.com/en/api.html#req.cookies
  if (req.cookies.name != "" && typeof(req.cookies.name) != 'undefined'){
    return req.cookies.name
  } else { //the above is what I added
    return {}
  }
}

function createAuth() {
  // TODO: implement
  // see https://github.com/request/request#http-authentication
  request.get('https://api.forter-secure.com', {
  'auth': {
    'bearer': 'NTNlZDA3ODQxYzNhZGQ5MzJkYzc4MzY2MWQ1NTA0OWIwM2ZjOGJlZjo'
  }
});
  return {}
}

function createHeaders() {
  // TODO: impelement
  // Use the headers from step 1
  return {}
}

function createOrder(id, forterToken, inputs) {
  // TODO: impelement
  // Use the request body from step 1
  return {}
  //rachel's code:
  return
  {
  "timeSentToForter": 1505891562000,
  "checkoutTime": 1505891562,
  "connectionInformation": {
    "customerIP": "10.0.0.127",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36",
    "forterTokenCookie": "2315688945984"
  },
  "orderId": "ps5942",
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
  const id = 'TEST'
  const auth = createAuth()
  const headers = createHeaders()
  const json = createOrder(id, forterToken, inputs)
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
