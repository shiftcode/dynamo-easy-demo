# dynamo-easy demo
![dynamo-easy](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LVwl0DaP3nICLR8V49z%2Favatar.png?generation=1549468480887077&alt=media)

This project serves as a showcase how dynamo-easy can be used.

Imagine a system where every employee of a company logs his work time per project with a start time and duration.
We use three models each with its table

- Project

- Employee

- TimeEntries

There are services one for each model to execute different operations on the tables.
There are also some write operation though we do not allow these for security reasons.
  
## credentials / security
This demo uses a cognito identity pool for unauthenticated read access to those 3 tables only - which means no write operations will succeed.
It's meant for you to play around with it directly in stackblitz or to clone it and test it out in your own stack.

## infrastructure
see infrastructure.yml for the essential resource definition

# Made with ❤ by [shiftcode.ch](https://www.shiftcode.ch)