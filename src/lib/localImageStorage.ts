'use client';

/**
 * Uploaded artwork is stored as binary data in IndexedDB rather than in the
 * localStorage JSON that holds scripts and project metadata.
 * Nothing in this module uploads files to a server.
 */
export const LOCAL_IMAGE_PREFIX = 'storyflow-image:';
const DB_NAME = 'storyflow-local-artwork-v1';
const STORE = 'images';
const VALID_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export interface StoredImage {
  id: string;
  blob: Blob;
  name: string;
  type: string;
}
export interface ImageBackup {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export function isLocalImage(url: string | undefined | null): boolean {
  return !!url && url.startsWith(LOCAL_IMAGE_PREFIX);
}

function db(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('This browser does not support offline artwork storage.'));
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const connection = request.result;
      if (!connection.objectStoreNames.contains(STORE)) {
        connection.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Cannot open the local artwork library.'));
    request.onblocked = () => reject(new Error('Close other StoryFlow tabs and try again.'));
  });
}

async function inStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore, resolve: (value: T) => void, reject: (error: Error) => void) => void
): Promise<T> {
  const connection = await db();
  return new Promise<T>((resolve, reject) => {
    const tx = connection.transaction(STORE, mode);
    let done = false;
    let value: T;
    tx.oncomplete = () => { connection.close(); if (!done) { done = true; resolve(value); } };
    tx.onerror = () => { connection.close(); if (!done) { done = true; reject(new Error('Local artwork storage failed. Check available device space.')); } };
    tx.onabort = () => { connection.close(); if (!done) { done = true; reject(new Error('Local artwork storage was interrupted.')); } };
    action(tx.objectStore(STORE),
      (v) => { value = v; },
      (err) => { if (!done) { done = true; connection.close(); reject(err); } });
  });
}

export async function saveLocalImage(file: File): Promise<string> {
  if (!VALID_TYPES.has(file.type)) throw new Error('Please choose a JPG, PNG, WebP, or GIF image.');
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('Each image must be smaller than 8 MB.');
  const id = crypto.randomUUID();
  await inStore<void>('readwrite', (store) => {
    store.put({ id, blob: file, name: file.name.slice(0, 140), type: file.type } satisfies StoredImage);
  });
  return LOCAL_IMAGE_PREFIX + id;
}

export async function readLocalImage(reference: string): Promise<StoredImage | undefined> {
  if (!isLocalImage(reference)) return undefined;
  const id = reference.slice(LOCAL_IMAGE_PREFIX.length);
  return inStore<StoredImage | undefined>('readonly', (store, resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result as StoredImage | undefined);
    request.onerror = () => reject(new Error('Could not read this local image.'));
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not include a visual asset in your backup.'));
    reader.readAsDataURL(blob);
  });
}

export async function exportImagesForBackup(): Promise<ImageBackup[]> {
  const images = await inStore<StoredImage[]>('readonly', (store, resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as StoredImage[]);
    request.onerror = () => reject(new Error('Could not read saved artwork.'));
  });
  return Promise.all(images.map(async (img) => ({
    id: img.id, name: img.name, type: img.type,
    dataUrl: await blobToDataUrl(img.blob)
  })));
}

export async function restoreImagesFromBackup(images: ImageBackup[]): Promise<void> {
  if (!Array.isArray(images)) return;
  if (images.length > 150) throw new Error('This backup has too many image files.');
  for (const image of images) {
    if (!image || typeof image.id !== 'string' || !/^[a-f0-9-]{20,80}$/i.test(image.id) ||
      typeof image.dataUrl !== 'string' || typeof image.name !== 'string' ||
      !VALID_TYPES.has(image.type) || image.dataUrl.length > MAX_IMAGE_BYTES * 1.4) {
      throw new Error('The backup contains invalid or oversized artwork.');
    }
    const prefix = 'data:' + image.type + ';base64,';
    if (!image.dataUrl.startsWith(prefix)) throw new Error('Invalid image data in backup.');
    const buffer = Uint8Array.from(atob(image.dataUrl.slice(prefix.length)), c => c.charCodeAt(0));
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error('An image in the backup is too large.');
    await inStore<void>('readwrite', store => {
      store.put({ id: image.id, blob: new Blob([buffer], { type: image.type }), name: image.name.slice(0, 140), type: image.type } satisfies StoredImage);
    });
  }
}
