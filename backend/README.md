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
    - For the following cases a 401 is thrown:
        1. Email isn't valid.
        2. Password and confirm password don't match.
        3. Password isn't valid.
    - The camp will be added to the database and the camp's details will be returned with a 201 status code.
3. Login:
    - *POST* ```/api/login```
    - Logs in a user.
    - If the user doesn't exist, a 401 is thrown.
    - If the password is incorrect, a 401 is thrown.
    - If the login was successful, the camp's details will be returned.
4. Logout:
    - *POST* ```/api/logout```
    - Logs out a user.
    - If the user isn't logged in, a 404 is thrown.
    - If the logout was successful, a 200 status code is returned.

## GET Methods

1. Getting all camps:
    - *GET* ```/api/get/all/camps```
    - Returns all camps in the database.
    - If no camps are found, a 404 is thrown.
    - The camps will be returned as a list of JSON objects along with a 200 status code.

2. Getting all refugees:
    - *GET* ```/api/get/all/refugees```
    - Returns all refugees in the database.
    - If no refugees were found, a 404 is thrown.
    - The refugees will be returned as a list of JSON objects along with a 200 status code.

3. Getting refugees based on CampID, Name or CountryOfOrigin:
    - *GET* ```/api/get/refugees```
    - Takes atleast one of two query paremeters:
        1. CampID (int) - Returns all refugees associated with the given CampID.
        2. Name (string) - Returns all refugees whose name contains the given string. (NOT IMPLEMENTED YET)
        3. CountryOfOrigin (string) - Returns all refugees belonging to the given country.
    - If no parameters were given, a 400 is thrown.
    - If no refugees were found, a 404 is thrown.
    - The refugees will be returned as a list of JSON objects along with a 200 status code.

4. Getting a camp based on the CampID or CampName:
    - *GET* ```/api/get/camp```
    - Takes one of two query paremeters:
        1. CampID (int) - Returns the camp associated with the given CampID.
        2. CampName (string) - Returns the camp whose name is the given string.
    - If both are given, the method priroritises CampID.
    - If no parameters were given, or the parameter keys were incorrect, a 400 is thrown.
    - If no camp was found, a 404 is thrown.
    - The camp will be returned as a JSON object along with a 200 status code.

## DELETE Methods

1. Deleting a refugee:
    - *DELETE* ```/api/delete/refugee/<id>```
    - Deletes a refugee entry from the database.
    - The user (Camp representative) must be logged in, otherwise a 403 is thrown.
    - If the refugee is not found, a 404 is thrown.
    - The refugee must be associated with the currently logged in user (Camp representative)'s CampID, otherwise a 403 is thrown.
    - The refugee will be deleted from the database and the refugee's details will be returned.

2. Deleting an account (A Camp):
    - *DELETE* ```/api/delete/camp/<id>```
    - Deletes a camp entry from the database, subsequently deleting all related refugees associated with that camp.
    - NOTE: This method is only available for **development purposes**, and has **NO SECURITY CHECKS**.
    - If the camp is not found, a 404 is thrown.
    - The camp will be deleted from the database and the camp's details will be returned along with a 204 status code.

## Methods for development

1. Add all camps
    - *POST* ```/api/post/camp/all```
    - Development method to add all camps to the database using Postman and the mock data available in the mock_data directory.
    - The request must include a list of JSON entries. Check the Postman workspace for an example.

2. Add all refugees to the database
    - *POST* ```/api/post/refugee/all```
    - Development method to add all refugee entries to the database using Postman and the mock data available in the mock_data directory.
    - The request must include a list of JSON entries. Check the Postman workspace for an example.
