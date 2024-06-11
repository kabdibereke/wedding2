import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, HttpClientModule],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
})
export class DividerComponent {
  @Input() public margin = true;
  @Input() public variant: 'default' | 'secondary' = 'default';
}
