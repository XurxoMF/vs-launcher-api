declare global {
  type DVersionType = {
    filename: string
    filesize: string
    md5: string
    urls: {
      cdn: string
      local: string
    }
  }

  type DVersionWrapperType = {
    [key: string]: DVersionType
  }

  type DVersionsType = {
    [key: string]: DVersionWrapperType
  }
}

export {}
