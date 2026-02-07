export class TranslatorService {
  private static GATEWAY_URL = 'https://aura.openclaw.ai/api/v1/translate'; // Placeholder for CF Tunnel

  static async translate(word: string): Promise<{ translation: string; examples: string[] }> {
    try {
      // In a real scenario, this would call the OpenClaw Gateway
      // For now, we simulate with a mock response or use a public API if available
      console.log(`Translating word: ${word}`);
      
      // Integration with OpenClaw LLM Proxy would go here
      const response = await fetch(this.GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, target: 'vi' })
      });

      if (!response.ok) throw new Error('Translation failed');
      return await response.json();
    } catch (error) {
      console.error('TranslatorService Error:', error);
      return {
        translation: 'Đang tải...',
        examples: ['Vui lòng kiểm tra kết nối Gateway.']
      };
    }
  }
}
