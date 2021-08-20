import { MessageManager } from './../../src/utils/MessageManager'

describe('MessageManager calls', () => {
  const messageManager = new MessageManager()


  it('should call getVideoInfos passing: an valid "whatsapp" youtube link and receive the expected videoInfos', () => {
    const videoInfos = messageManager.getVideoInfos('https://youtu.be/6rq7o2TUf6o')

    expect(videoInfos.isYoutubeLink).toBe(true)
    expect(videoInfos.id).toBe('6rq7o2TUf6o')
  })

  it('should call getVideoInfos passing: an valid "whatsapp" youtube link and receive the expected videoInfos', () => {
    const videoInfos = messageManager.getVideoInfos('https://youtu.be/oZgYN4qfpl4122222')

    expect(videoInfos.isYoutubeLink).toBe(true)
    expect(videoInfos.id).toBe('oZgYN4qfpl4122222')
  })

  it('should call getVideoInfos passing: an invalid "whatsapp" youtube link and receive an empty id', () => {
    const videoInfos = messageManager.getVideoInfos('https://youtu.be/oZgYN4qfpl')

    expect(videoInfos.isYoutubeLink).toBe(false)
    expect(videoInfos.id).toBe('')
  })

  it('should call getVideoInfos passing: an "original" youtube link and receive the expected videoInfos', () => {
    const videoInfos = messageManager.getVideoInfos('https://www.youtube.com/watch?v=oZgYN4qfpl4')

    expect(videoInfos.isYoutubeLink).toBe(true)
    expect(videoInfos.id).toBe('oZgYN4qfpl4')
  })

  it('should call getVideoInfos passing an invalid "original" youtube link and receive an empty id', () => {
    const videoInfos = messageManager.getVideoInfos('https://www.youtube.com/watch?v=oZgYN4qfpl')

    expect(videoInfos.isYoutubeLink).toBe(false)
    expect(videoInfos.id).toBe('')
  })

  it('should call getDesiredLinkFormat passing a videoID and receive the expected link format', () => {
    const videoLink = messageManager.getDesiredLinkFormat('oZgYN4qfpl4')

    expect(videoLink).toBe('https://www.youtube.com/watch?v=oZgYN4qfpl4')
  })

  it('should read commandsMapper passing: !formatos command and receive the expected sentence', () => {
    const sentence = messageManager.commandsMapper['!formatos']

    expect(sentence).toBe('Os exemplos são: \n 1 - https://youtu.be/oZgYN4qfpl4 \n 2 - https://www.youtube.com/watch?v=oZgYN4qfpl4')
  })
})