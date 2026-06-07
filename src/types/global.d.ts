declare global {
  type VersionType = {
    filename: string
    filesize: string
    md5: string
    urls: {
      cdn: string | null
      local: string | null
    }
  }

  type VersionWrapperType = {
    [platform: string]: VersionType | undefined;
    linux: VersionType;
    'macos-arm64'?: VersionType | undefined;
    'macos-x64': VersionType;
    windows: VersionType;
  }

  type VersionsType = {
    [version: string]: VersionWrapperType
  }

  type OptionalExceptFor<T, TRequired extends keyof T = keyof T> = Partial<Pick<T, Exclude<keyof T, TRequired>>> & Required<Pick<T, TRequired>>
}

export {}
