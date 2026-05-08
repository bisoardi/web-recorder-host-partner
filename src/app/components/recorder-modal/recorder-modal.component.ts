import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostMessageService } from '../../services/post-message.service';

@Component({
  selector: 'app-recorder-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recorder-modal.component.html',
  styleUrl: './recorder-modal.component.scss',
})
export class RecorderModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('recorderIframe') iframeRef!: ElementRef<HTMLIFrameElement>;
  @Input() recorderSessionId = '';
  @Input() launchToken = '';

  isOpen = false;
  spaUrl: SafeResourceUrl;

  constructor(
    private postMessageService: PostMessageService,
    private sanitizer: DomSanitizer,
  ) {
    this.spaUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://videoplatform-recorder-api-beta.truvideo.com');
  }

  ngAfterViewInit(): void {
    this.postMessageService.listenForReady(() => {
      this.postMessageService.sendLaunchToken(this.recorderSessionId, this.launchToken);
    });
  }

  open(): void {
    this.isOpen = true;
    // Esperamos al siguiente tick para que el iframe esté en el DOM
    setTimeout(() => {
      if (this.iframeRef?.nativeElement) {
        this.postMessageService.registerIframe(this.iframeRef.nativeElement);
      }
    });
  }

  close(): void {
    this.isOpen = false;
    this.postMessageService.removeReadyListener();
  }

  ngOnDestroy(): void {
    this.postMessageService.removeReadyListener();
  }
}
