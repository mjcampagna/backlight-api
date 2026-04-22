# backlight-api

Node.js client for the [Backlight](https://backlight.me) JSON API.

## Requirements

- Node.js 18+
- Backlight with JSON API enabled (**Admin → Settings → JSON API → Enable: yes**)

## Installation

```bash
npm install backlight-api
```

## Usage

```js
import Backlight from 'backlight-api'

const api = new Backlight({ apiUrl: 'https://yoursite.com/backlight/api' })

const album = await api.getAlbum(12345)
```

## Constructor

```js
new Backlight(options?)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | `string` | `'/backlight/api'` | Full URL to the API endpoint |

## Error handling

Methods throw on HTTP errors, so use `try`/`catch` or `.catch()`:

```js
// async/await
try {
  const album = await api.getAlbum(12345)
} catch (err) {
  console.error('Failed to fetch album:', err.message)
}

// Promise chain
api.getAlbum(12345)
  .then(album => { /* ... */ })
  .catch(err => console.error('Failed to fetch album:', err.message))
```

## Methods

All methods return a `Promise` and throw on HTTP errors.

An `apiToken` option can be passed to any method when your Backlight installation requires token-based request signing.

---

### `getAlbum(id, options?)`

Returns complete album data including title, description, and photos.

```js
const album = await api.getAlbum(12345)
const album = await api.getAlbum(12345, { apiToken: 'your-token' })
```

---

### `getPagedAlbum(id, options?)`

Returns album data in paged form.

```js
const album = await api.getPagedAlbum(12345)
```

---

### `getPhoto(id, options?)`

Returns data for a single photo.

```js
const photo = await api.getPhoto(67890)
```

---

### `getPhotos(id, options?)`

Returns the photos array for an album without additional album metadata. Supports optional range parameters.

```js
const photos = await api.getPhotos(12345)

// First ten photos
const photos = await api.getPhotos(12345, { from: 1, to: 10 })
```

| Option | Type | Description |
|--------|------|-------------|
| `from` | `string \| number` | Start of photo range (1-based) |
| `to` | `string \| number` | End of photo range |
| `apiToken` | `string` | Request signing token |

---

### `getPhotosForPage(id, options)`

Returns photos for a specific page of a paged album.

```js
const photos = await api.getPhotosForPage(12345, { page: 2 })
```

| Option | Type | Description |
|--------|------|-------------|
| `page` | `string \| number` | **Required.** Page number |
| `apiToken` | `string` | Request signing token |

---

### `getRoot(id?, options?)`

Returns top-level set (publisher root) data. Pass an `id` to fetch a specific root; omit it to fetch all roots.

```js
// All publisher roots
const roots = await api.getRoot()

// Specific root (e.g. default galleries set)
const root = await api.getRoot(1)
```

## Finding IDs

Album and photo IDs are visible in the URL when browsing your site in Backlight's publisher interface.

## Direct API Endpoints

The underlying REST endpoints, if you prefer to call them directly:

| Endpoint | Description |
|----------|-------------|
| `GET /backlight/api/get_album/:id` | Album with photos |
| `GET /backlight/api/get_paged_album/:id` | Paged album |
| `GET /backlight/api/get_photo/:id` | Single photo |
| `GET /backlight/api/get_photos/:id/(:from)/(:to)` | Photos array |
| `GET /backlight/api/get_photos_for_page/:id/:page` | Photos for a page |
| `GET /backlight/api/get_publisher_root/:id` | Single top-level set |
| `GET /backlight/api/get_all_publisher_roots` | All top-level sets |
