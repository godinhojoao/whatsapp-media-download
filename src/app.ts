import { create, Client, Message } from '@open-wa/wa-automate'
import { MessageManager } from './utils/MessageManager'
import { MediaManager } from './utils/MediaManager'

async function processMessage (client: Client, message: Message): Promise<void> {
  const messageManager = new MessageManager()

  const link = await messageManager.handleMessage(client, message)

  if (link) {
    const mediaManager = new MediaManager(link)

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

async function start (client: Client): Promise<void> {
  await client.onMessage(message => processMessage(client, message))
}

create({
  authTimeout: 0,
  callTimeout: 0
})
  .then(client => { start(client) })
  .catch(err => console.log(err))
