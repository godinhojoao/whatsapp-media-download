import { create, Client, Message } from '@open-wa/wa-automate'
import { MessageManager } from './utils/MessageManager'
import { MediaManager } from './utils/MediaManager'

async function processMessage (client: Client, message: Message): Promise<void> {
  const messageManager = new MessageManager()
  const currentCommand = messageManager.commands[message.body.trim()]

  if (currentCommand) {
    await client.reply(message.from, currentCommand, message.id)
  } else {
    const { link, format } = await messageManager.handleMessage(client, message)

    if (link && format) {
      const mediaManager = new MediaManager(link)

      mediaManager.downloadAudio()
        .then(async ({ stream, filename, filePath }): Promise<void> => {
          stream.on('finish', async (): Promise<void> => {
            await messageManager.sendAndDeleteMedia(client, message, filename, filePath)
          })
        })
        .catch(error => console.log(error))
    }
  }
}

async function start (client: Client): Promise<void> {
  await client.onMessage(async (message) => await processMessage(client, message))
}

create({
  authTimeout: 0,
  callTimeout: 0,
  qrTimeout: 0
})
  .then(client => { start(client) })
  .catch(err => console.log(err))
