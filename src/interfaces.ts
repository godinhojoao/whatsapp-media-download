import type fs from 'fs'

export interface OcurrencesMap {
  [key: string]: number;
}

export interface Map {
  [key: string]: string;
}

export interface Media {
  stream: fs.WriteStream;
  filename: string;
  filePath: string;
}

export interface IMediaManager {
  downloadAudio: () => Promise<Media>;
}

export interface videoInfos {
  isYoutubeLink: boolean;
  id: string;
}

export interface StringMapper {
  [key: string]: string;
}

export interface DownloadInfos {
  link: string;
  format: string;
}

export interface IFilenameFormatter {
  getDesiredFilename: (filename: string, format: string) => string;
}
