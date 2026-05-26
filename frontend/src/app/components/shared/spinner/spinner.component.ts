import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div [class]="containerClass">
      <div [class]="'spinner ' + (large ? 'spinner-lg' : '')"></div>
      <p *ngIf="message" class="text-slate-400 text-sm mt-3 font-body">{{ message }}</p>
    </div>
  `,
})
export class SpinnerComponent {
  @Input() large = false;
  @Input() message = '';
  @Input() centered = false;

  get containerClass(): string {
    return this.centered
      ? 'flex flex-col items-center justify-center py-16'
      : 'flex flex-col items-center';
  }
}
