import { FilenameFormatter } from './../../src/utils/FilenameFormatter'

describe('FilenameFormatter calls', () => {
  const filenameFormatter = new FilenameFormatter()

  it('should call getDesiredFileName passing: -j-oao- and receive the expected filename', () => {
    const filename = filenameFormatter.getDesiredFilename('-j-oao-', 'mp3')

    expect(filename).toBe('-joao.mp3')
  })

  it('should call getDesiredFileName passing: -dale--dale- and receive the expected filename', () => {
    const filename = filenameFormatter.getDesiredFilename('-dale--dale-', 'mp3')

    expect(filename).toBe('-daledale.mp3')
  })

  it('should call getDesiredFileName passing: Iron & Wine - Flightless Bird, American Mouth and receive the expected filename', () => {
    const filename = filenameFormatter.getDesiredFilename('Iron & Wine - Flightless Bird, American Mouth', 'mp3')

    expect(filename).toBe('Iron & Wine - Flightless Bird, American Mouth.mp3')
  })

  it('should call getDesiredFileName passing: Iron && Wine -- Flightless -Bird, American Mouth and receive the expected filename', () => {
    const filename = filenameFormatter.getDesiredFilename('Iron && Wine -- Flightless -Bird, American Mouth', 'mp3')

    expect(filename).toBe('Iron & Wine - Flightless Bird, American Mouth.mp3')
  })

  it('should call getDesiredFileName passing: Turma do Pagode - Lancinho (Ao vivo) and receive the expected filename', () => {
    const filename = filenameFormatter.getDesiredFilename('     Turma do Pagode - Lancinho (Ao vivo)', 'mp3')

    expect(filename).toBe('Turma do Pagode - Lancinho (Ao vivo).mp3')
  })
})
