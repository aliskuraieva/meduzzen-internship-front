import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() modalTitle: string = '';
  @Input() modalContent: string = '';
  isVisible: boolean = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
