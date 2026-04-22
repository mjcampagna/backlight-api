export interface WebImage {
  height: number
  url: string
  width: number
}

export interface Rendition {
  height: number
  width: number
}

export interface Photo {
  album_id: number
  capture_time: string | null
  created: string
  downloadExtension: string
  downloadPath: string
  filename: string
  id: string
  latitude: number | null
  longitude: number | null
  metadata: Record<string, unknown>
  modified: string
  path: string
  renditions: Record<string, Rendition>
  sequence: number
  title: string
  url: string
}

export interface ParentAlbum {
  breadcrumb: string
  href: string
  id: number
  name: string
}

export interface Album {
  breadcrumb: string
  children?: Album[]
  cover_image: WebImage | null
  created: string
  description: string
  hero_image: WebImage | null
  id: number
  items_per_page: number
  modified: string
  page_copy: string
  parent_id: number | null
  parents: ParentAlbum[]
  photos: Photo[]
  publisher_root_id: number
  sidebar_copy: string
  slug: string
  title: string
  total_photos: number
  tray2_copy: string
  type: 'album' | 'set' | 'topLevel'
  url: string
}

export type PagedAlbum = Omit<Album, 'photos'>

export interface PublisherRoot {
  breadcrumb: string
  created: string
  description: string
  id: number
  modified: string
  path: string
  slug: string
  title: string
  url: string
}

export interface PublisherRootDetail extends PublisherRoot {
  children: Album[]
  ordering: string
  page_copy: string
  page_copy_placement: string
  sidebar_copy: string
  sidebar_copy_placement: string
  template: string
  tray2_copy: string
  tray2_copy_placement: string
}

export interface GetAlbumResponse {
  album: Album
}

export interface GetPagedAlbumResponse {
  album: PagedAlbum
}

export interface GetPhotoResponse {
  photo: Photo
}

export interface GetPhotosResponse {
  photos: Photo[]
}

export interface GetAllPublisherRootsResponse {
  publisherRoots: PublisherRoot[]
}

export interface GetPublisherRootResponse {
  publisherRoot: PublisherRootDetail
}
