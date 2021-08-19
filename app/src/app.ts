import { create } from '@open-wa/wa-automate'
import { MessageManager } from './utils/MessageManager'
import { MediaManager } from './utils/MediaManager'

create()
  .then(client => {
    const messageManager = new MessageManager()

    client.onMessage(async message => {
      const videoInfos = messageManager.getVideoID(message.body)

      if (!videoInfos || !videoInfos.isYoutubeLink) {
        return await client.reply(message.from, 'Envie apenas um link do Youtube!', message.id)
      } else {
        const desiredLinkFormat = messageManager.getDesiredLinkFormat(videoInfos.id)
        const mediaManager = new MediaManager(desiredLinkFormat)

        mediaManager.downloadAudio()
          .then(async ({ stream, filename, filePath }) => {
            stream.on('finish', async () => {
              console.log(`Download de ( ${filename} ) concluído com sucesso!`)

              await messageManager.sendAndDeleteMedia(client, message, filename, filePath)
            })
          })
          .catch(error => console.log(error))
      }
    })
  })
  .catch(err => console.log(err))
