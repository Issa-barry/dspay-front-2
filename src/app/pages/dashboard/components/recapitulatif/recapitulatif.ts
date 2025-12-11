import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recapitulatif',
  imports: [CommonModule],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss'
})
export class RecapitulatifComponent {
  @Input() eurAmount: number = 0;
  @Input() gnfAmount: number = 0;
  @Input() beneficiaryName: string = '';
  @Input() walletName: string = '';
  @Input() withdrawalPoint: string = 'Dabompa Tamisso';
  @Input() fees: number = 2;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() modify = new EventEmitter<void>();

  get totalAmount(): number {
    return this.eurAmount + this.fees;
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onModify() {
    this.modify.emit();
  }
}