import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() variant: 'default' | 'secondary' = 'default';

  @Output() public clicked = new EventEmitter<void>();
}
