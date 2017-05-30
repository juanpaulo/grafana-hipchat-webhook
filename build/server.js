'use strict';

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a server with a host and port
var server = new _hapi2.default.Server();
server.connection({
  host: '0.0.0.0' || 'localhost',
  port: process.env.PORT || 8000
});

// Add the route
server.route({
  method: 'POST',
  path: '/',
  handler: function handler(request, reply) {
    // console.log(request.payload);
    var payload = request.payload;
    var body = {
      "color": "red", //$state(ok:green, alerting:red)
      "message": '@all ' + payload.title,
      "notify": true,
      "message_format": "text",
      "card": {
        "style": "media",
        "url": '' + payload.ruleUrl,
        "title": '' + payload.ruleName,
        "description": {
          "value": '' + payload.message,
          "format": "text"
        },
        "thumbnail": {
          "url": '' + payload.imageUrl,
          "url@2x": '' + payload.imageUrl,
          "width": 3313,
          "height": 577
        }
      }
    };
    var options = {
      method: 'POST',
      uri: 'https://rakuten.hipchat.com/v2/room/3704706/notification?auth_token=ScPcItp32gLip4kPBPhvztsLK3xojGU9ZuuZwwQd',
      body: body,
      json: true // Automatically stringifies the body to JSON
    };
    (0, _requestPromise2.default)(options).then(function (parsedBody) {
      return reply();
    }).catch(function (err) {
      var message = err.error.error.message;
      console.log(message);
      return reply(_boom2.default.badRequest(message));
    });
  }
});

// Start the server
server.start(function (err) {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});