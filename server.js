import rp from 'request-promise';
import Hapi from 'hapi';
import Boom from 'boom';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0' || 'localhost',
  port: process.env.PORT || 8000
});

// Add the route
server.route({
  method: 'POST',
  path:'/',
  handler(request, reply) {
    // console.log(request.payload);
    const payload = request.payload;
    const body = {
    	"color": "red", //$state(ok:green, alerting:red)
      "message": `@all ${payload.title}`,
    	"notify": true,
    	"message_format": "text",
    	"card": {
    		"style": "media",
    		"url": `${payload.ruleUrl}`,
    		"title": `${payload.ruleName}`,
    		"description": {
    			"value": `${payload.message}`,
    			"format": "text"
    		},
    		"thumbnail": {
    			"url": `${payload.imageUrl}`,
    			"url@2x": `${payload.imageUrl}`,
    			"width": 3313,
    			"height": 577
    		}
    	}
    };
    const options = {
      method: 'POST',
      uri: `${process.env.HIPCHAT_URL}/v2/room/${process.env.HIPCHAT_ROOM_ID}/notification?auth_token=${process.env.HIPCHAT_ROOM_NOTIFICATION_TOKEN}`,
      body: body,
      json: true // Automatically stringifies the body to JSON
    };
    rp(options)
    .then(parsedBody => {
      return reply();
    })
    .catch(err => {
      const message = err.error.error.message;
      console.log(message);
      return reply(Boom.badRequest(message));
    });
  }
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
