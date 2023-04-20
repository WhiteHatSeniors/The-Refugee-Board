# Backend for TheRefugeeBoard

# API Endpoints

## POST Methods

1. Adding a refugee:
    - *POST* ```/api/post/refugee```
    - Adds a refugee entry into the database.
    - The user (Camp representative) must be logged in, otherwise a 403 is thrown.
    - The refugee details are sent as a JSON object with the following keys:
        1. Name
        2. Gender
        3. Age
        4. CountryOfOrigin
        5. Message
    - The refugee will automatically be associated with a CampID equal to the currently logged in user (Camp representative)'s CampID.
    - The refugee will be added to the database and the refugee's details will be returned.
2. Adding a camp:
    - *POST* ```/api/register```
    - Adds a camp entry into the database.
    - If the user exists, a 409 is thrown.
    - The camp will be added to the database and the camp's details will be returned.

## Methods for development

1. Add all camps
    - Development method to add all camps to the database using Postman and the mock data available in the mock_data directory.
    - The request must include a list of JSON entries. Check the Postman workspace for an example.
    - *POST* ```/api/post/camp/all```

2. Add all refugees to the database
    - Development method to add all refugee entries to the database using Postman and the mock data available in the mock_data directory.
    - The request must include a list of JSON entries. Check the Postman workspace for an example.
    - *POST* ```/api/post/refugee/all```
