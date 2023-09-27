import { app } from "./app"
import http from "http"
import httpProxy from "http-proxy"
import internal from "stream"

const port = app.get("port")
const server = app.listen(port, onListening)
//const server = http.createServer(app)
const proxy = httpProxy.createProxyServer({
  ws: true,
  target: "http://frontend:3888",
})

//server.on("listen", onListening)
server.on("error", onError)
server.on(
  "upgrade",
  function (req: http.IncomingMessage, socket: internal.Duplex, head: Buffer) {
    proxy.ws(req, socket, head)
  },
)

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
