import { NgClass, NgStyle } from '@angular/common';
import { booleanAttribute, Component, ElementRef, EventEmitter, Input, numberAttribute, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside/click-outside.directive';

@Component({
  selector: 'app-tree-list-element',
  standalone: true,
  imports: [RouterLink, NgClass, NgStyle, ClickOutsideDirective],
  templateUrl: './tree-list-element.component.html',
  styleUrl: './tree-list-element.component.scss'
})
export class TreeListElementComponent {
  @Input({transform: numberAttribute, required: true}) treeId = -1;
  @Input({required: true}) name = '';
  @Input({transform: booleanAttribute}) isCreated = false;

  @Output() grantPermission = new EventEmitter<number>();

  @ViewChild("menu", {read: ElementRef}) menuEl: ElementRef | undefined;

  menuIsRendered = false;
  menuCoordinates = {
    'top.px': 0,
    'left.px': 0,
  }

  constructor() {}

  openMenu() {
    if (this.menuEl === undefined) {
      return;
    }

    const nativeElement: HTMLElement = this.menuEl.nativeElement;
    const rect: DOMRect = nativeElement.getBoundingClientRect();

    this.menuCoordinates = {
      'top.px': rect.bottom,
      'left.px': rect.right,
    };

    this.menuIsRendered = true;
  }

  closeMenu(targetElement: any) {
    if (this.menuIsRendered && targetElement !== this.menuEl?.nativeElement) {
      this.menuIsRendered = false;
    }
  }

  emitGrantPermission() {
    this.grantPermission.emit(this.treeId);
    this.menuIsRendered = false;
  }
}
