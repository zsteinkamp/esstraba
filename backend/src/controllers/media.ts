import { Request, Response } from "express"
import path from "path"

export const show = async (req: Request, res: Response): Promise<void> => {
  console.log(req.path)
  if (req.path.match(/\.\./) || !req.path.match(/^\/media\//)) {
    res.send({ status: 404, msg: "Not Found" })
    return
  }
  res.sendFile(path.resolve(`data/${req.path}`))
}
