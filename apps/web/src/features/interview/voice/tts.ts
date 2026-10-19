/**
 * Text-to-speech provider abstraction (Phase 3C).
 *
 * Same architectural style as the STT/Ollama seams: a minimal interface with
 * swappable implementations. The default implementation uses the device-local
 * browser speechSynthesis engine (free, no key, no cloud). A backend Piper
 * provider can implement the same interface later without touching callers.
 */

export interface TTSProvider {
  readonly name: string;
  /** Whether synthesis can actually produce audio in this environment. */
  isSupported(): boolean;
  /** Speak text; resolves when playback ends (or when safely skipped). */
  speak(text: string): Promise<void>;
  /** Stop any in-progress playback. */
  stop(): void;
}

function estimateTimeoutMs(text: string): number {
  // ~150 wpm floor with a 6s minimum and 60s cap; used only as a safety net
  // if the engine never fires its end event (e.g. headless browsers).
  return Math.min(60000, Math.max(6000, Math.ceil((text.split(/\s+/).length / 150) * 60000)));
}

export class SpeechSynthesisTTSProvider implements TTSProvider {
  readonly name = 'speech-synthesis';
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const synth = (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
    return (
      !!synth &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    );
  }

  speak(text: string): Promise<void> {
    if (!this.isSupported()) return Promise.resolve();
    const trimmed = text.trim();
    if (!trimmed) return Promise.resolve();
    return new Promise((resolve) => {
      this.stop();
      const utterance = new SpeechSynthesisUtterance(trimmed);
      this.currentUtterance = utterance;
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        if (this.currentUtterance === utterance) this.currentUtterance = null;
        resolve();
      };
      utterance.onend = done;
      utterance.onerror = done;
      window.speechSynthesis.speak(utterance);
      window.setTimeout(done, estimateTimeoutMs(trimmed));
    });
  }

  stop(): void {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Non-fatal: playback cleanup must never break the interview.
    }
    this.currentUtterance = null;
  }
}

/** Text-only fallback: resolves instantly so interviews never depend on audio. */
export class SilentTTSProvider implements TTSProvider {
  readonly name = 'silent';
  isSupported(): boolean {
    // Silent produces no audio by design, so callers can show the text-only
    // fallback instead of playback controls.
    return false;
  }
  async speak(): Promise<void> {
    return undefined;
  }
  stop(): void {
    return undefined;
  }
}

/**
 * Plays server-synthesized response audio (Phase 3D) in the browser.
 * Deliberately separate from the TTSProvider speak-text seam: the server
 * owns synthesis (local Piper sidecar), the browser only owns playback.
 * No audio is ever fabricated here — play() only renders backend bytes.
 */
export class ServerAudioPlayer {
  private element: HTMLAudioElement | null = null;
  private done: (() => void) | null = null;

  /**
   * Play base64 WAV bytes. Resolves true when playback actually started;
   * resolves false (after invoking onDone) when the browser refuses.
   */
  async play(base64Wav: string, onDone: () => void): Promise<boolean> {
    this.stop();
    this.done = onDone;
    try {
      const element = new Audio(`data:audio/wav;base64,${base64Wav}`);
      this.element = element;
      element.onended = () => this.finish();
      element.onerror = () => this.finish();
      await element.play();
      return true;
    } catch {
      this.finish();
      return false;
    }
  }

  /** Stop playback. A pending onDone still fires so waiters never dangle. */
  stop(): void {
    const element = this.element;
    this.element = null;
    if (element) {
      element.onended = null;
      element.onerror = null;
      try {
        element.pause();
      } catch {
        // Non-fatal: teardown must never break the interview.
      }
    }
    const done = this.done;
    this.done = null;
    if (element && done) done();
  }

  private finish(): void {
    this.element = null;
    const done = this.done;
    this.done = null;
    if (done) done();
  }
}

export function getTTSProvider(): TTSProvider {
  const device = new SpeechSynthesisTTSProvider();
  return device.isSupported() ? device : new SilentTTSProvider();
}
