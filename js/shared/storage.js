// storage.js – gerenciamento de sessionStorage e localStorage
'use strict';

export function setItem(key, value, session = true) {
  try {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] setItem falhou:', e);
  }
}

export function getItem(key, session = true, defaultValue = null) {
  try {
    const storage = session ? sessionStorage : localStorage;
    const item = storage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

export function removeItem(key, session = true) {
  try {
    const storage = session ? sessionStorage : localStorage;
    storage.removeItem(key);
  } catch (e) {
    console.warn('[storage] removeItem falhou:', e);
  }
}

// Chaves do player de áudio
export const KEY_PLAYING = 'yuri_audio_playing';
export const KEY_TRACK   = 'yuri_audio_track';
export const KEY_TIME    = 'yuri_audio_time';
export const KEY_VOLUME  = 'yuri_audio_volume';