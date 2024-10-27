import { booleanAttribute, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnChanges {
  @Input({transform: booleanAttribute, required: true}) isShownModal = false;

  @Output() closeModal = new EventEmitter();

  @ViewChild("dialog", {read: ElementRef}) dialogEl?: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    const chIsShownModal = changes['isShownModal'];

    if (this.dialogEl === undefined) {
      return;
    }

    if (chIsShownModal.currentValue) {
      this.dialogEl.nativeElement.showModal();
    } else {
      this.dialogEl.nativeElement.close();
    }
  }

  closeDialog()                       { this.closeModal.emit(); }
  stopDialogPropagation(event: Event) { event.stopImmediatePropagation(); }
}
