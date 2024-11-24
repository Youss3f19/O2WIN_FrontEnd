import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Modal Title'; // Titre de la modal
  @Input() message: string = 'This is a modal message.'; // Message de la modal
  @Output() closeModal = new EventEmitter<void>(); // Événement pour fermer la modal

  close() {
    this.closeModal.emit();
  }
}
