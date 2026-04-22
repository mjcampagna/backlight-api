export type {
  WebImage,
  Rendition,
  Photo,
  ParentAlbum,
  Album,
  PagedAlbum,
  PublisherRoot,
  PublisherRootDetail,
  GetAlbumResponse,
  GetPagedAlbumResponse,
  GetPhotoResponse,
  GetPhotosResponse,
  GetAllPublisherRootsResponse,
  GetPublisherRootResponse,
} from './types.js'

import type {
  GetAlbumResponse,
  GetPagedAlbumResponse,
  GetPhotoResponse,
  GetPhotosResponse,
  GetAllPublisherRootsResponse,
  GetPublisherRootResponse,
} from './types.js'

export interface BacklightOptions {
  apiUrl?: string
}

export interface GetPhotosOptions {
  apiToken?: string
  from?: string | number
  to?: string | number
}

export interface GetPhotosForPageOptions {
  apiToken?: string
  page: string | number
}

export interface ApiTokenOptions {
  apiToken?: string
}

class Backlight {
  private apiUrl: string
  private rewriteEnabled: boolean

  constructor(options: BacklightOptions = {}) {
    this.apiUrl = options.apiUrl ?? '/backlight/api'
    this.rewriteEnabled = !/publisher/.test(this.apiUrl)
  }

  private hash(plainString: string): number {
    let ascii = 0
    for (let i = 0; i < plainString.length; i++) {
      ascii += plainString.charCodeAt(i)
    }
    return ascii
  }

  private handleToken(apiToken?: string): string {
    if (!apiToken) return ''
    const r = new Date().getTime()
    const cs = this.hash('' + r + apiToken + 'AvBxtC4mvKCJVqv')
    return (this.rewriteEnabled ? '?' : '&') + 'r=' + r + '&cs=' + cs
  }

  private buildPath(action: string, parameters?: (string | number)[]): string {
    let path = ''

    if (this.rewriteEnabled) {
      path = this.apiUrl + '/' + action
      if (Array.isArray(parameters)) {
        path += '/' + parameters.join('/')
      }
    } else {
      path = this.apiUrl + '&a=' + action
      if (Array.isArray(parameters)) {
        for (let i = 0; i < parameters.length; i++) {
          path += '&p' + (i + 1) + '=' + parameters[i]
        }
      }
    }

    return path
  }

  private async request<T>(url: string): Promise<T> {
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      throw new Error(`Backlight API error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  }

  getAlbum(id: string | number, options: ApiTokenOptions = {}): Promise<GetAlbumResponse> {
    return this.request(this.buildPath('get_album', [id]) + this.handleToken(options.apiToken))
  }

  getPagedAlbum(id: string | number, options: ApiTokenOptions = {}): Promise<GetPagedAlbumResponse> {
    return this.request(this.buildPath('get_paged_album', [id]) + this.handleToken(options.apiToken))
  }

  getPhoto(id: string | number, options: ApiTokenOptions = {}): Promise<GetPhotoResponse> {
    return this.request(this.buildPath('get_photo', [id]) + this.handleToken(options.apiToken))
  }

  getPhotos(id: string | number, options: GetPhotosOptions = {}): Promise<GetPhotosResponse> {
    const parameters: (string | number)[] = [id]
    if (options.from != null) parameters.push(options.from)
    if (options.to != null) parameters.push(options.to)
    return this.request(this.buildPath('get_photos', parameters) + this.handleToken(options.apiToken))
  }

  getPhotosForPage(id: string | number, options: GetPhotosForPageOptions): Promise<GetPhotosResponse> {
    return this.request(
      this.buildPath('get_photos_for_page', [id, options.page]) + this.handleToken(options.apiToken)
    )
  }

  getRoot(id: string | number, options?: ApiTokenOptions): Promise<GetPublisherRootResponse>
  getRoot(id?: undefined, options?: ApiTokenOptions): Promise<GetAllPublisherRootsResponse>
  getRoot(id?: string | number, options: ApiTokenOptions = {}): Promise<GetPublisherRootResponse | GetAllPublisherRootsResponse> {
    const path = id
      ? this.buildPath('get_publisher_root', [id])
      : this.buildPath('get_all_publisher_roots')
    return this.request(path + this.handleToken(options.apiToken))
  }
}

export { Backlight }
export default Backlight
