interface OcurrencesMap {
  [key: string]: number;
}

interface Map {
  [key: string]: string | undefined;
}

export class FilenameFormatter {
  private readonly bannedSignals: Array<string>
  private readonly signalsPreferences: Map

  constructor () {
    this.signalsPreferences = {
    }
    this.bannedSignals = [
      '/', '\\', '"', '<', '>', '[', ']', '|', '°', '?', "'", '=', ':', 'vevo', 'video',
      '(', ')', 'VEVO', 'Video', 'Vevo'
    ]
    // todo: identify a word indifferently if it is: upper ou lowercase, and put just 1 word on this array
  }

  private getSignalsOcurrences (filename: string): OcurrencesMap {
    const signalsOcurrences: OcurrencesMap = {}

    this.bannedSignals.forEach(signal => {
      if (filename.indexOf(signal) > -1) {
        if (signalsOcurrences[signal]) {
          signalsOcurrences[signal]++
        }

        if (!signalsOcurrences[signal]) {
          signalsOcurrences[signal] = 1
        }
      }
    })

    return signalsOcurrences
  }

  private formatFilename (fileName: string, signal: string, preferedSignal: string): string {
    return fileName.split(signal).join(preferedSignal)
  }

  public getDesiredFileName (fileName: string, format: string): string {
    const signalsPreferencesMapper = (preferedSignal: string): string => this.signalsPreferences[preferedSignal] || ''
    const signalsOcurrences = this.getSignalsOcurrences(fileName)

    this.bannedSignals.forEach(signal => {
      const preferedSignal = signalsPreferencesMapper(signal)

      if (fileName.indexOf(signal) > -1) {
        fileName = this.formatFilename(fileName, signal, preferedSignal)
      }
    })

    // todo: consider signalsOcurrences and if signalsOcurrences[signal] >= 2 we need to remove one signal
    console.log('signalsOcurrences', signalsOcurrences)
    return `${fileName.trim()}.${format}`
  }
}
