import axios from 'axios';


export default {
  id: 'badges-user',
  handler: (router, { env }) => {  
 
    const API_BASE_URL = env.BADGES_BASE_URL || "";

    router.get('/', (req, res) => {
      res.send(`hello world here is the base url ${API_BASE_URL}`);
      console.log("Using base URL:", env.BADGES_BASE_URL);
   
    });

//  for getting user badges---------------

    router.get('/:user_id', async (req, res) => {
      try {

        const { user_id } = req.params;
        const url = `${API_BASE_URL}/api/v1/users/${user_id}/badges`;
        console.log("hie",url)
        const response = await axios.get(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        res.json({"message":response.data});
      } catch (error) {
        // Error handling...
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