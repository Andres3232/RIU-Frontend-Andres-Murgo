import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalComponent {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  confirmRemove = output<boolean>();


  onConfirmRemove(): void {
    this.confirmRemove.emit(true);
  }

  open(): void {
    this.dialogRef.nativeElement.showModal();
  }

  close(): void {
    this.dialogRef.nativeElement.close();
  }
}
