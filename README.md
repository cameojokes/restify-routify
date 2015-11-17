# restify-routify - Extendable routes with restify.

- [Router](#router)
	- [`new Router(String name [, String param])`]()
	- [`.<method>(Function handler, ...)`]()
	- [`.extend(Router router)`]()
	- [`.routify(Server app)`]()

## `new Router(String name [, String param])`

`String name` - The URL prefix for the router(`/<name>`). This argument is optional if you wish to create an extendable router for the root path(`/`).

`String param` - The URL parameter for members of this routes collection(`/<name>/:<param>`). This argument is optional, and should only be provided when the router is used for a collection.

To create a base router for `/accounts`:

```
var accountsRouter = new Router('accounts', 'accountId');
```

## `Router.<method>(Function handler [, Function handler ...])`

Where `method` is one of `del|get|list|patch|post|put`. The arguments should be a list of middleware/route handlers.

```
// DELETE /accounts/:accountId
accountsRouter.del([middleware, ...] deleteAccount);
// GET /accounts/:accountId
accountsRouter.get([middleware, ...] getAccount);
// GET /accounts
accountsRouter.list([middleware, ...] listAccounts);
// POST /accounts/:accountId
accountsRouter.post([middleware, ...] createAccount);
// PUT /accounts/:accountId
accountsRouter.post([middleware, ...] updateAccount);
```

## `Router.extend(Router router)`

Extend a route.

```
var usersRouter = new Router('users', 'userId');

usersRouter.del([middleware, ...] deleteUser);
usersRouter.get([middleware, ...] getUser);
usersRouter.list([middleware, ...] listUsers);
usersRouter.post([middleware, ...] createUser);
usersRouter.put([middleware, ...] updateUser);
```

Now that we have the user routes. Let's extend the account router.

```
accountsRouter.extend(usersRouter);
```

accountsRouter now contains the additional routes:

```
DELETE /accounts/:accountId/users/:userId
GET /accounts/:accountId/users/:userId
GET /accounts/:accountId/users
POST /accounts/:accountId/users
PUT /accounts/:accountId/users/:userId
```

## `Router.routify(Server app)`

To apply the router to your app:

```
accountsRouter.routify(app);
```
### API Documentation

http://cameojokes.github.io/restify-routify
