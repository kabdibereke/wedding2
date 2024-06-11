import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
})
export class SelectButtonComponent {
  @Input() label?: string;
  @Input() required = false;
  @Input() options: string[] = [];
  @Input() selectedOption?: string;
  @Input() variant: 'default' | 'secondary' = 'default';
  @Input() size: 'default' | 'small' = 'default'; // Add the size input
  @Output() optionSelected = new EventEmitter<string>();

  onSelect(option: string) {
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }
}
