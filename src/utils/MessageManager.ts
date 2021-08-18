import { Client, Message } from '@open-wa/wa-automate'
import fs from 'fs'
import path from 'path'

interface VideoInfos {
  isYoutubeLink: boolean;
  id: string;
}

export class MessageManager {
  getVideoID (videoURL: string): VideoInfos {
    const youtubeLink = videoURL.match(/https:\/\/youtu\.be\/(.*)/)

    if (!youtubeLink) {
      return { isYoutubeLink: false, id: 'false' }
    }

    return { isYoutubeLink: true, id: youtubeLink[1] }
  }

  getDesiredLinkFormat (videoID: string): string {
    const desiredFormatLink = 'https://www.youtube.com/watch?v=' + videoID

    return desiredFormatLink
  }

  async sendAndDeleteMedia (client: Client, message: Message, fileName: string): Promise<void> {
    const filePath = path.resolve('src/medias', `${fileName}`)
    await client.sendFile(message.from, filePath, fileName, 'dale')

    fs.unlink(path.resolve('medias', `${fileName}`), () => {
      console.log(`Arquivo ${fileName} excluído com sucesso!`)
    })
  }
}
