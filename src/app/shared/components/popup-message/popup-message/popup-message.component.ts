import { NgClass } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss'
})
export class PopupMessageComponent {
  @Input({ alias: "is-succeed", required: true, transform: booleanAttribute}) isSucceed!: boolean;
  @Input({}) message?: string;
}
