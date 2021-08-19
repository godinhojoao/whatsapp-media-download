import ytdl from 'ytdl-core'
import fs from 'fs'
import path from 'path'

import { FilenameFormatter } from './FilenameFormatter'

interface Media {
  stream: fs.WriteStream;
  filename: string;
  filePath: string;
}

export class MediaManager {
  constructor (
    private readonly link: string
  ) {
    this.link = link
  }

  async downloadAudio (): Promise<Media> {
    const infos = await ytdl.getInfo(this.link)
    const fileName = infos.player_response.videoDetails.title
    const filenameFormatter = new FilenameFormatter()

    const desiredFileName = filenameFormatter.getDesiredFileName(fileName, 'mp3')
    const filePath = path.resolve(__dirname, '..', 'medias', desiredFileName)

    const videoReadableStream = ytdl(this.link, { filter: 'audioonly' })
    const videoWritableStream = fs.createWriteStream(filePath)

    const stream = videoReadableStream.pipe(videoWritableStream)

    return { stream: stream, filename: desiredFileName, filePath: filePath }
  }
}
