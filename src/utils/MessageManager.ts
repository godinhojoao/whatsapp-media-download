import { Client, Message } from '@open-wa/wa-automate'
import { DownloadInfos, StringMapper, videoInfos } from '../interfaces'
import fs from 'fs'

export class MessageManager {
  private readonly defaultWarnings: StringMapper;
  public readonly commands: StringMapper;

  constructor () {
    this.defaultWarnings = {
      'is-not-link': 'Envie apenas um link do Youtube! \n\nPara conhecer os formatos de links permitidos digite: !formatos',
      'starting-download': 'Estou começando a baixar a sua mídia, isso pode demorar um pouco!'
    }
    this.commands = {
      '!formatos': 'Os exemplos são: \n1 - https://youtu.be/oZgYN4qfpl4 \n2 - https://www.youtube.com/watch?v=oZgYN4qfpl4'
    }
  }

  private getVideoInfos (videoURL: string): videoInfos {
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

  public async handleMessage (client: Client, message: Message): Promise<DownloadInfos> {
    const defaultWarnings = this.defaultWarnings
    const videoInfos = this.getVideoInfos(message.body.trim())

    if (!videoInfos || !videoInfos.isYoutubeLink || !(videoInfos.id.length >= 11)) {
      await client.reply(message.from, defaultWarnings['is-not-link'], message.id)

      return { link: '', format: '' }
    } else {
      await client.sendText(message.from, defaultWarnings['starting-download'])

      const desiredLinkFormat = this.getDesiredLinkFormat(videoInfos.id)

      return { link: desiredLinkFormat, format: 'mp3' }
    }
  }

  public async sendAndDeleteMedia (client: Client, message: Message, filename: string, filePath: string): Promise<void> {
    client.sendFile(message.from, filePath, filename, '')
      .then(() => {
        fs.unlink(filePath, () => {
          console.log(`Arquivo ** ${filename} ** enviado e excluído com sucesso!`)
        })
      })
  }
}
