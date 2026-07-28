// Mock expo-clipboard for testing
export async function setStringAsync(_text: string): Promise<void> {}
export async function getStringAsync(): Promise<string> { return ''; }
