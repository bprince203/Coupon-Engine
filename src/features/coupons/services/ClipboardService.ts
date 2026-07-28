/**
 * ClipboardService — Abstraction over expo-clipboard.
 * Provides copy-to-clipboard with success/failure signaling.
 */

import * as Clipboard from 'expo-clipboard';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}
