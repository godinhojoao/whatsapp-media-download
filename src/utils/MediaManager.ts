import ytdl from 'ytdl-core'
import fs from 'fs'
import path from 'path'

import { FilenameFormatter } from './FilenameFormatter'
import { Media, IMediaManager } from '../interfaces'

export class MediaManager implements IMediaManager {
  constructor (
    private readonly link: string
  ) {
    this.link = link
  }

  private saveFilename (filename: string): void {
    const dbPath = path.resolve(__dirname, '..', 'allFilenames.data.json')

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '')
    }

    fs.readFile(dbPath, 'utf8', function (err, data) {
      if (err) { console.log('this file does not exists, yet') }

      const currentDate = new Date().toLocaleString()
      const filenamesDB = data ? JSON.parse(data) : { updatedAt: '', filenames: [] }

      filenamesDB.updatedAt = currentDate
      filenamesDB.filenames.push(filename)

      fs.writeFile(dbPath, JSON.stringify(filenamesDB, null, 2), err => {
        if (err) { return console.log('error on save filename') }
      })
    })
  }

  public async downloadAudio (): Promise<Media> {
    const infos = await ytdl.getInfo(this.link)
    const videoTitle = infos.player_response.videoDetails.title
    const filenameFormatter = new FilenameFormatter()

    const desiredFileName = filenameFormatter.getDesiredFilename(videoTitle, 'mp3')
    const filePath = path.resolve(__dirname, '..', 'medias', desiredFileName)

    this.saveFilename(desiredFileName)

    const videoReadableStream = ytdl(this.link, { filter: 'audioonly' })

    if (!fs.existsSync(path.resolve(__dirname, '..', 'medias'))) {
      fs.mkdirSync(path.resolve(__dirname, '..', 'medias'))
    }
    const videoWritableStream = fs.createWriteStream(filePath)

    const stream = videoReadableStream.pipe(videoWritableStream)

    return { stream: stream, filename: desiredFileName, filePath: filePath }
  }
}
