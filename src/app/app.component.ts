import { Component } from '@angular/core';

type SettingKey =
  | 'textToSpeech'
  | 'highlightLinks'
  | 'cursor'
  | 'darkMode'
  | 'invertColors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'accessibilityproj';

  settings: Record<SettingKey | 'textToSpeech', boolean> = {
    textToSpeech: false,
    highlightLinks: false,
    cursor: false,
    darkMode: false,
    invertColors: false,
  };

  // Multi-levels (0 means off)
  biggerTextSize: number = 0; 
  smallerTextSize: number = 0; 
  lineHeightLevel: number = 0; 
  textSpacingLevel: number = 0; 

  computeClass() {
    return {
      // Bigger Text 
      'text-lg': this.biggerTextSize === 1,
      'text-xl': this.biggerTextSize === 2,
      'text-2xl': this.biggerTextSize === 3,
      // 'text-3xl': this.biggerTextSize === 4,

      // Smaller Text 
      'text-sm': this.smallerTextSize === 1,
      'text-xs': this.smallerTextSize === 2,
      'text-[0.65rem]': this.smallerTextSize === 3,
      // 'text-[0.5rem]': this.smallerTextSize === 4,

      // Line height
      'leading-relaxed': this.lineHeightLevel === 1,
      'leading-loose': this.lineHeightLevel === 2,
      'leading-[2.2]': this.lineHeightLevel === 3,

      // Text spacing
      'tracking-wide': this.textSpacingLevel === 1,
      'tracking-wider': this.textSpacingLevel === 2,
      'tracking-[0.4em]': this.textSpacingLevel === 3,

      'highlight-links': this.settings.highlightLinks,
      cursorcus: this.settings.cursor,
      dark: this.settings.darkMode,
      invert: this.settings.invertColors,
    };
  }

  toggleSetting(setting: SettingKey | 'textToSpeech') {
    this.settings[setting] = !this.settings[setting];
    if (setting === 'textToSpeech') {
      this.handleTextToSpeech();
    }
  }

  // bigger text size 
  biggerText() {
    this.biggerTextSize = (this.biggerTextSize + 1) % 4;
    if (this.biggerTextSize > 0) {
      // When bigger text active, smaller text off
      this.smallerTextSize = 0;

      console.log(this.biggerTextSize);
    }
  }

  smallerText() {
    this.smallerTextSize = (this.smallerTextSize + 1) % 4;
    if (this.smallerTextSize > 0) {
      this.biggerTextSize = 0;
    }
  }

  lineHeight() {
    // this.lineHeightLevel = (this.lineHeightLevel + 1) % 4;
    this.lineHeightLevel++;
    if (this.lineHeightLevel > 3) {
      this.lineHeightLevel = 0;
    }
  }

  textSpacing() {
    this.textSpacingLevel = (this.textSpacingLevel + 1) % 4;
  }

  handleTextToSpeech() {
    if (this.settings.textToSpeech) {
      const utterance = new SpeechSynthesisUtterance(
        'Click on any text to read it aloud.'
      );
      speechSynthesis.speak(utterance);

      setTimeout(() => {
        const readableElements = document.querySelectorAll(
          'p, h1, h2, h3, h4, h5, h6, button, a, li, span'
        );
        readableElements.forEach((el: Element) => {
          el.addEventListener('click', this.readTextOnClick);
        });
      }, 500);
    } else {
      speechSynthesis.cancel();
      const readableElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, button, a, li, span'
      );
      readableElements.forEach((el: Element) => {
        el.removeEventListener('click', this.readTextOnClick);
      });
    }
  }

  readTextOnClick = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (target.tagName.toLowerCase() === 'mat-icon') return;

    const clone = target.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('mat-icon');
    icons.forEach((icon) => icon.remove());

    const ariaLabel = target.getAttribute('aria-label');
    const text = ariaLabel || clone.innerText.trim();

    if (text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  resetAll() {
    speechSynthesis.cancel();

    this.settings = {
      textToSpeech: false,
      highlightLinks: false,
      cursor: false,
      darkMode: false,
      invertColors: false,
    };
    this.biggerTextSize = 0;
    this.smallerTextSize = 0;
    this.lineHeightLevel = 0;
    this.textSpacingLevel = 0;

    const readableElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, button, a, li, span'
    );
    readableElements.forEach((el: Element) => {
      el.removeEventListener('click', this.readTextOnClick);
    });
  }
}
