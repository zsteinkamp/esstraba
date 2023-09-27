import { app } from "./app"

const port = app.get("port")

const server = require('http').createServer(app);
server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});
server.on("error", onError)
server.listen(port)
const server = app.listen(port, onListening)

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case "EADDRINUSE":
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
}

export default server
