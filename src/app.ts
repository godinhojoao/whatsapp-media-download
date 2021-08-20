import { create } from '@open-wa/wa-automate'
import { MessageManager } from './utils/MessageManager'
import { MediaManager } from './utils/MediaManager'

create()
  .then(client => {
    const messageManager = new MessageManager()

    client.onMessage(async (message): Promise<void> => {
      const currentCommandValue = messageManager.commandsMapper[message.body]

      if (currentCommandValue) {
        await client.reply(message.from, currentCommandValue, message.id)
      } else {
        const videoInfos = messageManager.getVideoInfos(message.body)

        if (!currentCommandValue && (!videoInfos || !videoInfos.isYoutubeLink || !(videoInfos.id.length >= 11))) {
          await client.reply(message.from, 'Envie apenas um link do Youtube!', message.id)
          await client.sendText(
            message.from,
            'Para conhecer os formatos de links permitidos digite: !formatos'
          )
        } else {
          await client.sendText(
            message.from,
            'Estou começando a baixar a sua música!'
          )

          const desiredLinkFormat = messageManager.getDesiredLinkFormat(videoInfos.id)
          const mediaManager = new MediaManager(desiredLinkFormat)

          mediaManager.downloadAudio()
            .then(async ({ stream, filename, filePath }): Promise<void> => {
              stream.on('finish', async (): Promise<void> => {
                await messageManager.sendAndDeleteMedia(client, message, filename, filePath)
                console.log(`Download de ** ${filename} ** concluído com sucesso!`)
              })
            })
            .catch(error => console.log(error))
        }
      }
    })
  })
  .catch(err => console.log(err))
