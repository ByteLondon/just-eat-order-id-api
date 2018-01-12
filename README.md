# Just Eat Order Id API

### Dev setup
```yarn install
yarn start
createuser --pwprompt name  //(if you don't already have a user)
createdb --encoding=UTF-8 --owner=name just-eat-order-id-api
```

### DB migrations
- To create the sql files that store the sql code for the up and down commands run: `./node_modules/.bin/db-migrate create create-<table-name>-table --sql-file`
- Setup the structure of the db by running: `./node_modules/.bin/db-migrate up`. You'll need to do this after every structural change to the db. It's best to run `... up`, `... down` and `... up` again to make sure the down code works as expected

### Make sure Node is up-to-date on the EC2 instance

1. run `sudo apt-get update`
2. if you get a `NO_PUBKEY` error run this to fix it: `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
3. run `curl -sL https://deb.nodesource.com/setup_9.x -o nodesource_setup.sh`
4. check it looks OK then run `sudo bash nodesource_setup.sh`
