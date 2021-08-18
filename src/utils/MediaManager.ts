import ytdl from 'ytdl-core'
import fs from 'fs'
import path from 'path'

export class MediaManager {
  constructor (
    public readonly link: string
  ) {
    this.link = link
  }

  async getDesiredFileName (format: string): Promise<string> {
    const bannedSignals = ['/', '\\', '"', '<', '>', '[', ']', '|', '°', '?', "'", '=']
    const infos = await ytdl.getInfo(this.link)

    let musicName = infos.player_response.videoDetails.title.trim()
    let authorName = infos.player_response.videoDetails.author.trim().slice(0, 20)
    bannedSignals.forEach(signal => {
      if (musicName.indexOf(signal) > -1) {
        musicName = musicName.replace(signal, '')
      }

      if (authorName.indexOf(signal) > -1) {
        authorName = authorName.replace(signal, '')
      }
    })

    let desiredFileName = `${authorName} - ${musicName}.${format}`

    return desiredFileName
  }

  async downloadAudio (): Promise<string> {
    const desiredFileName = await this.getDesiredFileName('mp3')

    const videoReadableStream = await ytdl(this.link, { filter: 'audio' })
    const videoWritableStream = await fs.createWriteStream(path.resolve('src/medias', `${desiredFileName}`))

    const stream = await videoReadableStream.pipe(videoWritableStream)

    await stream.on('finish', () => {
      console.log(`Download de ( ${desiredFileName} ) completo.`)
    })

    return desiredFileName
  }
}
