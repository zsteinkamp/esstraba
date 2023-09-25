import { Request, Response } from "express"
import path from "path"

export const show = async (req: Request, res: Response): Promise<void> => {
  console.log(req.path)
  if (req.path.match(/\.\./) || !req.path.match(/^\/activities\//)) {
    res.send({ status: 404, msg: "Not Found" })
    return
  }
  // TODO handle gzip
  res.sendFile(path.resolve(`data/${req.path}`))
}
