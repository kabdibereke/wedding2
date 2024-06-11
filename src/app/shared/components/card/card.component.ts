import { Component, Input } from '@angular/core';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ScrollAnimationDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() public header = '';
  @Input() public subheader = '';

  @Input() public enablePadding = true;
}
