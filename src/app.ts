import { create } from '@open-wa/wa-automate'
import { MessageManager } from './utils/MessageManager'
import { MediaManager } from './utils/MediaManager'

create()
  .then(client => {
    const messageManager = new MessageManager()

    client.onMessage(async message => {
      const videoInfos = messageManager.getVideoID(message.body)
      if (!videoInfos.isYoutubeLink) {
        return await client.reply(message.from, 'Envie apenas um link do Youtube!', message.id)
      } else {
        const desiredLinkFormat = messageManager.getDesiredLinkFormat(videoInfos.id)
        const mediaManager = new MediaManager(desiredLinkFormat)

        const fileName = await mediaManager.downloadAudio()

        console.log('desiredLinkFOrmat', desiredLinkFormat)
        console.log('filename', fileName)
      }
    })
  })
  .catch(err => console.log(err))
