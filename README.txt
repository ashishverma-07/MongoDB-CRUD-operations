Command-line nodejs program which is invoked as:

$ db_ops.js DB_URL OP
DB_URL is the URL for a mongo database instance and OP is a JSON string

OP specifies the CRUD operation which is being performed on the database specified by DB_URL. It must have the following top-level members:

op
Must have a value which must be one of "create", "read", "update" or "delete".

collection
Must specify the name of the collection on which the operation specified by op is performed.

PLEASE NOTE: After running a command on the terminal, once the respective process has occurred, kindly press CTRL-C (everytime) to end it and then enter next command on the command line.

