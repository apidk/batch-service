## Batch service

Requirements: node version 18 or higher

### Installation
In the project directory run: `npm install`

### Run
To start the project: `npm start`
To visit the hello world page go to: 'http://localhost:3000'
To visit the swagger page, go to: 'http://localhost:3000/api'

### Batch request
POST '/batch'

Example request:
```JSON
{
  "url": "https://httpstat.us/{statusCode}",
  "verb": "GET",
  "payloads": [
    {
      "statusCode": 200
    },
    {
      "statusCode": 400
    }
  ],
  "body": {
    "test": "body"
  }
}
```

Example response:
```JSON
{
  "responses": [
    {
      "success": true,
      "statusCode": 200,
      "responseBody": {
        "test": "body"
      }
    },
    {
      "success": false,
      "statusCode": 400,
      "responseBody": {
        "test": "body"
      }
    }
  ]
}
```
