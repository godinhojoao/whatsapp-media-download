import { FilenameFormatter } from './../../src/utils/FilenameFormatter'

describe('FilenameFormatter', () => {
  it('should call fileNameFormatter.getDesiredFileName and receive the filename', () => {
    const fileNameFormatter = new FilenameFormatter()
    const filename = fileNameFormatter.getDesiredFileName('Iron & Wine - Flightless Bird, American Mouth', 'mp3')

    expect(filename).toBe('joao')
  })
})
