import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecorderModalComponent } from './components/recorder-modal/recorder-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecorderModalComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('recorderModal') recorderModal!: RecorderModalComponent;

  recorderSessionId = 'mock-session-001';
  launchToken = 'mock-launch-token-base64url-xxxxxxxxxxxxxxxx';

  openRecorder(): void {
    this.recorderModal.open();
  }
}
