import { Injectable, OnDestroy } from '@angular/core';

export interface PostMessagePayload {
  type: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class PostMessageService implements OnDestroy {
  private iframeRef: HTMLIFrameElement | null = null;
  private spaOrigin = 'https://videoplatform-recorder-api-beta.truvideo.com';
  private readyListener: ((event: MessageEvent) => void) | null = null;

  registerIframe(iframe: HTMLIFrameElement): void {
    this.iframeRef = iframe;
  }

  sendLaunchToken(recorderSessionId: string, launchToken: string): void {
    if (!this.iframeRef?.contentWindow) {
      console.warn('[PostMessageService] iframe not ready');
      return;
    }
    const payload: PostMessagePayload = {
      type: 'TRUVIDEO_RECORDER_LAUNCH',
      recorderSessionId,
      launchToken,
    };
    this.iframeRef.contentWindow.postMessage(payload, this.spaOrigin);
    console.log('[PostMessageService] TRUVIDEO_RECORDER_LAUNCH sent');
  }

  listenForReady(onReady: () => void): void {
    this.readyListener = (event: MessageEvent) => {
      if (event.origin !== this.spaOrigin) return;
      if (event.data?.type === 'READY') {
        console.log('[PostMessageService] SPA is READY');
        onReady();
      }
    };
    window.addEventListener('message', this.readyListener);
  }

  removeReadyListener(): void {
    if (this.readyListener) {
      window.removeEventListener('message', this.readyListener);
      this.readyListener = null;
    }
  }

  ngOnDestroy(): void {
    this.removeReadyListener();
  }
}
