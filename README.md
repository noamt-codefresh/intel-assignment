# Intel Assignment

Build todo list app service.


####Prerequisites

- Docker environment for mac or windows.

##Setup

- Once cloned, cd to cloned repo and run `docker-compose up -d`
in order to build and run environment (first time can take a while since docker is building and pulling missing images).
- Once services are built it can take ~15 seconds till they are up and running (can be verified in todo-service/ui logs with `docker logs -f <container_id>`). 

###Demo Instructions

Navigate to http://localhost:4200

####Register and login with a new user
- On login page click "Register" to create a new user
- Enter user name and password.
- After a successful registration you will be redirected to login page for further authentication.
- Login with your user and password.

####Todo list CRUD operations

- CREATE LIST: Enter a list name and click create to create a new list.
- CREATE LIST ITEM: Once list is created you can add items by entering item name in the "new item" input and click create to add it.
- UPDATE LIST ITEM COMPLETION STATUS: Click item's checkbox to mark it as done or unmark it for undone.
- UPDATE LIST ITEM NAME: Click on desired item's "edit" button to edit item's name, once done click save.
- DELETE LIST ITEM: Click on desired item's "delete" to delete item 