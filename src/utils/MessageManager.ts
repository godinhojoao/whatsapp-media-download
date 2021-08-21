import { Client, Message } from '@open-wa/wa-automate'
import fs from 'fs'

interface VideoInfos {
  isYoutubeLink: boolean;
  id: string;
}

interface StringMapper {
  [key: string]: string;
}

export class MessageManager {
  private readonly defaultWarnings: StringMapper;

  constructor () {
    this.defaultWarnings = {
      'is-not-link': 'Envie apenas um link do Youtube!',
      'send-advice': 'Para conhecer os formatos de links permitidos digite: !formatos',
      '!formatos': 'Os exemplos são: \n 1 - https://youtu.be/oZgYN4qfpl4 \n 2 - https://www.youtube.com/watch?v=oZgYN4qfpl4',
      'starting-download': 'Estou começando a baixar a sua música!'
    }
  }

  private getVideoInfos (videoURL: string): VideoInfos {
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

  private getDesiredLinkFormat (videoID: string): string {
    const desiredFormatLink = 'https://www.youtube.com/watch?v=' + videoID

    return desiredFormatLink
  }

  public async handleMessage (client: Client, message: Message): Promise<string> {
    const defaultWarnings = this.defaultWarnings
    const currentCommandValue = defaultWarnings[message.body.trim()]

    if (currentCommandValue) {
      await client.reply(message.from, currentCommandValue, message.id)

      return ''
    } else {
      const videoInfos = this.getVideoInfos(message.body.trim())

      if (!currentCommandValue && (!videoInfos || !videoInfos.isYoutubeLink || !(videoInfos.id.length >= 11))) {
        await client.reply(message.from, defaultWarnings['is-not-link'], message.id)
        await client.sendText(message.from, defaultWarnings['send-advice'])

        return ''
      } else {
        await client.sendText(message.from, defaultWarnings['starting-download'])

        const desiredLinkFormat = this.getDesiredLinkFormat(videoInfos.id)
        return desiredLinkFormat
      }
    }
  }

  public async sendAndDeleteMedia (client: Client, message: Message, filename: string, filePath: string): Promise<void> {
    await client.sendFile(message.from, filePath, filename, '')

    fs.unlink(filePath, () => {
      console.log(`Arquivo ** ${filename} ** enviado e excluído com sucesso!`)
    })
  }
}
