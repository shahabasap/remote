import axios from 'axios';


export default {
  id: 'badges-event',
  handler: (router, { env }) => {  // Add env parameter here
    // Get the base URL from environment or use default
    const API_BASE_URL = env.BADGES_BASE_URL || "";


// for creating event POST /badges-event/event  
	// This endpoint is for creating events	
    router.post('/', async (req, res) => {
      try {

		if (!req.accountability?.user) {
			return res.status(403).send('Authentication required');
		  }
		  
        const { event_type, user_id, payload, timestamp } = req.body;
        
        if (!event_type || !user_id || !payload) {
          return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['event_type', 'user_id', 'payload']
          });
        }

        const eventData = {
          event_type,
          user_id,
          payload,
          timestamp: timestamp || new Date().toISOString()
        };

        const response = await axios.post(`${API_BASE_URL}/api/v1/events`, eventData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        res.json(response.data);
      } catch (error) {
        // Error handling remains the same
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
          res.status(502).json({ error: 'No response from upstream server' });
        } else {
          res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
          });
        }
      }
    });

   
  }
};