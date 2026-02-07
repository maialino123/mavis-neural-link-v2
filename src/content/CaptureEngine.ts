export class CaptureEngine {
  private lastWord: string = '';
  private timer: any = null;
  private onCaptured: (word: string, rect: DOMRect) => void;

  constructor(onCaptured: (word: string, rect: DOMRect) => void) {
    this.onCaptured = onCaptured;
    document.addEventListener('mouseover', (e) => this.handleHover(e));
  }

  private handleHover(e: MouseEvent) {
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (!range) return;

    const node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const offset = range.startOffset;
      
      const words = text.split(/(\s+)/);
      let currentPos = 0;
      let targetWord = '';

      for (const word of words) {
        if (offset >= currentPos && offset < currentPos + word.length) {
          targetWord = word.trim().replace(/[.,!?;:]/g, '');
          break;
        }
        currentPos += word.length;
      }

      if (targetWord && targetWord !== this.lastWord && targetWord.length > 2) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.lastWord = targetWord;
          const rect = range.getBoundingClientRect();
          this.onCaptured(targetWord, rect);
        }, 500);
      }
    }
  }
}
