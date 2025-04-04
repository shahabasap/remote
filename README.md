API Endpoints
1. Badges Event Endpoint
Path: /badges-event/event

POST - Create a new badge event
Creates a new event in the badges system.

Request:

json
Copy
{
  "event_type": "string",
  "user_id": "string",
  "payload": "object",
  "timestamp": "string (ISO format, optional)"
}
Required Fields:

event_type

user_id

payload

Response:

Success: Returns the created event from the badges service

Error: Returns appropriate error status and message

Example:

```
curl -X POST \
  -H "Authorization: Bearer YOUR_DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_type":"check-in","user_id":"user123","payload":{"platform":"web"}}' \
  http://your-directus-instance/badges-event/event

```
2. Badges User Endpoint
Path: /badges-user/:user_id

GET - Retrieve user badges
Fetches all badges for a specific user.

Parameters:

user_id (path parameter): The ID of the user whose badges to retrieve

Response:

Success: Returns the user's badges from the badges service

Error: Returns appropriate error status and message

Example:

bash
Copy
curl -X GET \
  -H "Authorization: Bearer YOUR_DIRECTUS_TOKEN" \
  http://your-directus-instance/badges-user/user123
