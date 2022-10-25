# Connector Service

## Hook module

A nGage service hook is a module that handle logic from nGage api to Core bank or Client backend.

Normally, one request from nGage endpoint will be delegate to hook service in three phases:

- **preAction**: For early validate request payload. You can trigger client request validation or early denied request for your logic. **Implement this hook is optional**.
  <p>Ex: If you want to restrict only username with special form can be registered `preRegister` is the place to do that.

- **processAction**: This is main logic for this action. Normally this hook is the place to call client api to do the job. **Implement this hook is required**
  <p>

- **postAction**: This is for trigger side effect of this action if need. Just like `preAction`, **implement this hook is optional**
  <p>Ex: Call client service for logging successfully transfer command.
