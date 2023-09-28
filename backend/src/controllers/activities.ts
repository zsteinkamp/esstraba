import { Request, Response } from "express"
import path from "path"
import fs from "fs"
import zlib from "zlib"

export const show = async (req: Request, res: Response): Promise<void> => {
  console.log(req.path)
  if (req.path.match(/\.\./) || !req.path.match(/^\/activities\//)) {
    res.send({ status: 404, msg: "Not Found" })
    return
  }

  const stream = req.path.match(/\.gz$/) ?
    fs.createReadStream(`/app/data${req.path}`).pipe(zlib.createGunzip())
    :
    fs.createReadStream(`/app/data${req.path}`)

  res.header('content-type', 'application/gpx+xml')
  res.header('content-disposition', `attachment; filename="${req.path.split('/')[0].replace(/\.gz$/, '')}"`)
  stream.pipe(res)
}
