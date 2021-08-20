interface OcurrencesMap {
  [key: string]: number;
}

interface Map {
  [key: string]: string | undefined;
}

export class FilenameFormatter {
  private readonly signalsPreferences: Map
  private readonly bannedSignals: string[]
  private readonly signalsMaxOne: string[]

  constructor () {
    this.signalsPreferences = {
    }
    // todo: identify a word indifferently if it is: upper or lowercase, and put just 1 word on this array
    this.bannedSignals = [
      '/', '\\', '"', '<', '>', '[', ']', '|', '°', '?', "'", '=', ':', 'vevo', 'video',
      'VEVO', 'Video', 'Vevo', '*', '.', ';'
    ]
    this.signalsMaxOne = [
      '-', '&', '(', ')'
    ]
  }

  private getSignalsOcurrences (signals: string[], filename: string): OcurrencesMap {
    const signalsOcurrences: OcurrencesMap = {}
    let letter: string

    signals.forEach((signal: string): void => {
      for (letter of filename) {
        if (letter === signal) {
          if (!signalsOcurrences[signal]) {
            signalsOcurrences[signal] = 1
          } else {
            signalsOcurrences[signal]++
          }
        }
      }
    })

    return signalsOcurrences
  }

  private removeAllSignals (filename: string): string {
    const signalsPreferencesMapper = (preferedSignal: string): string => this.signalsPreferences[preferedSignal] || ''

    this.bannedSignals.forEach((signal: string): void => {
      const preferedSignal = signalsPreferencesMapper(signal)

      if (filename.indexOf(signal) > -1) {
        filename = filename.split(signal).join(preferedSignal)
      }
    })

    return filename
  }

  private removeExtraSignals (filename: string, signal: string, signalOcurrencesQuantity: number) {
    const splitedFilename = filename.split('')

    for (let i = splitedFilename.length - 1; i >= 0; i--) {
      if (signalOcurrencesQuantity >= 2 && splitedFilename[i] === signal) {
        splitedFilename.splice(i, 1)
        signalOcurrencesQuantity--
      }
    }

    return splitedFilename.join('')
  }

  public getDesiredFilename (filename: string, format: string): string {
    const signalsMaxOneOcurrences = this.getSignalsOcurrences(this.signalsMaxOne, filename)

    Object.keys(signalsMaxOneOcurrences).forEach((signal: string): void => {
      filename = this.removeExtraSignals(filename, signal, signalsMaxOneOcurrences[signal])
    })

    filename = this.removeAllSignals(filename)

    return `${filename.trim()}.${format}`
  }
}
