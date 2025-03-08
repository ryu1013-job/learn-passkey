import { decode, encode } from 'base64-arraybuffer'

/**
 * ArrayBuffer を base64url 形式の文字列に変換する
 * isoBase64URL.fromBuffer と同等の動作を目指す
 */
export function bufferToBase64URL(buffer: ArrayBuffer): string {
  // base64-arraybuffer の encode を使って base64 に変換
  const base64 = encode(buffer)
  // base64 を base64url に変換（+→-、/→_、末尾の=除去）
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * base64url 形式の文字列を ArrayBuffer に変換する
 * isoBase64URL.toBuffer と同等の動作を目指す
 */
export function base64URLToBuffer(base64url: string): ArrayBuffer {
  // 必要なパディングを追加し、base64url から標準の base64 に戻す
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4)
  const base64 = (base64url + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  return decode(base64)
}
