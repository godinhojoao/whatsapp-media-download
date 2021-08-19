import { Client, Message } from '@open-wa/wa-automate'
import fs from 'fs'

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

  async sendAndDeleteMedia (client: Client, message: Message, filename: string, filePath: string): Promise<void> {
    await client.sendFile(message.from, filePath, filename, 'dale')

    fs.unlink(filePath, () => {
      console.log(`Arquivo ${filename} enviado e excluído com sucesso!`)
    })
  }
}
