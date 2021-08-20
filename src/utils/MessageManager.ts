import { Client, Message } from '@open-wa/wa-automate'
import fs from 'fs'

interface VideoInfos {
  isYoutubeLink: boolean;
  id: string;
}

interface CommandsMapper {
  [key: string]: string;
}

export class MessageManager {
  public readonly commandsMapper: CommandsMapper;

  constructor () {
    this.commandsMapper = {
      '!formatos': 'Os exemplos são: \n 1 - https://youtu.be/oZgYN4qfpl4 \n 2 - https://www.youtube.com/watch?v=oZgYN4qfpl4'
    }
  }

  public getVideoInfos (videoURL: string): VideoInfos {
    const youtubeWhatsappLink = videoURL.match(/https:\/\/youtu\.be\/(.*)/)
    const youtubeOriginalLink = videoURL.match(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/)
    const urlMatches = [youtubeOriginalLink, youtubeWhatsappLink]

    let id = ''
    urlMatches.forEach((urlMatch): void => {
      if (urlMatch) {
        id = urlMatch[1]
      }
    })

    if (!id || id.length < 11) {
      return { isYoutubeLink: false, id: '' }
    }

    return { isYoutubeLink: true, id: id }
  }

  public getDesiredLinkFormat (videoID: string): string {
    const desiredFormatLink = 'https://www.youtube.com/watch?v=' + videoID

    return desiredFormatLink
  }

  public async sendAndDeleteMedia (client: Client, message: Message, filename: string, filePath: string): Promise<void> {
    await client.sendFile(message.from, filePath, filename, '')

    fs.unlink(filePath, () => {
      console.log(`Arquivo ** ${filename} ** enviado e excluído com sucesso!`)
    })
  }
}
