interface OcurrencesMap {
  [key: string]: number;
}

interface Map {
  [key: string]: string;
}

export class FilenameFormatter {
  private readonly signalsPreferences: Map
  private readonly bannedSignals: string[]
  private readonly signalsWithLimit: string[]
  private readonly signalsLimit: OcurrencesMap

  constructor () {
    // todo: identify a word indifferently if it is: upper or lowercase, and put just 1 word on this array
    this.bannedSignals = [
      '/', '\\', '"', '<', '>', '[', ']', '|', '°', '?', "'", '=', ':', 'vevo',
      'VEVO', 'Vevo', '*', '.', ';'
    ]
    this.signalsPreferences = {
      // we can put some signal and the prefered signal to replace it
      // example --> '&': '>'
    }
    this.signalsWithLimit = [
      '-', '&', '(', ')'
    ]
    this.signalsLimit = {
      // we can put some signal and its limits
      // example --> '&': 2 // default === 1
    }
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

  private removeExtraSignals (filename: string, signal: string, signalOcurrencesQuantity: number, limit?: number) {
    const splitedFilename = filename.split('')

    if (!limit) {
      limit = 1
    }

    for (let i = splitedFilename.length - 1; i >= 0; i--) {
      if (signalOcurrencesQuantity > limit && splitedFilename[i] === signal) {
        splitedFilename.splice(i, 1)
        signalOcurrencesQuantity--
      }
    }

    return splitedFilename.join('')
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

  public getDesiredFilename (filename: string, format: string): string {
    const signalsWithLimitOcurrences = this.getSignalsOcurrences(this.signalsWithLimit, filename)

    Object.keys(signalsWithLimitOcurrences).forEach((signal: string): void => {
      filename = this.removeExtraSignals(filename, signal, signalsWithLimitOcurrences[signal], this.signalsLimit[signal])
    })

    filename = this.removeAllSignals(filename)

    if (filename.length > 46) {
      filename = filename.substr(0, 46)
    }

    return `${filename.trim()}.${format}`
  }
}
