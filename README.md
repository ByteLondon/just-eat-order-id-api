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