## How to setup the project ##

### Install nodeenv ###

**nodeenv** used to isolate the node versions on the system 

    pip3 install nodeenv

Create a virtualenv with the 17 nod version

    nodeenv -n 17.1.0 env

Active it 

    . env/bin/activate

### How to start the dev server for development? ###

    npm install
    npm run dev


### How to build the prod version? ###

    npm run build-prod
