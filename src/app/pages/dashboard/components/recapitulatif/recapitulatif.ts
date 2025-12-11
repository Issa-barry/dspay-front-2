import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recapitulatif',
  imports: [CommonModule],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss'
})
export class RecapitulatifComponent implements OnInit {
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

  ngOnInit() {
    // Afficher toutes les données au chargement du récapitulatif
    console.log('=== RÉCAPITULATIF - TOUTES LES DONNÉES ===');
    console.log('Montant en EUR:', this.eurAmount);
    console.log('Montant en GNF:', this.gnfAmount);
    console.log('Bénéficiaire:', this.beneficiaryName);
    console.log('Mode de paiement:', this.walletName);
    console.log('Point de retrait:', this.withdrawalPoint);
    console.log('Frais:', this.fees);
    console.log('Total à payer:', this.totalAmount);
    console.log('========================================');
    
    // Ou en format objet pour copier facilement
    const recapData = {
      eurAmount: this.eurAmount,
      gnfAmount: this.gnfAmount,
      beneficiaryName: this.beneficiaryName,
      walletName: this.walletName,
      withdrawalPoint: this.withdrawalPoint,
      fees: this.fees,
      totalAmount: this.totalAmount
    };
    console.table(recapData); // Affichage sous forme de tableau
  }

  onConfirm() {
    console.log('=== CONFIRMATION DU TRANSFERT ===');
    console.log({
      eurAmount: this.eurAmount,
      gnfAmount: this.gnfAmount,
      beneficiaryName: this.beneficiaryName,
      walletName: this.walletName,
      withdrawalPoint: this.withdrawalPoint,
      fees: this.fees,
      totalAmount: this.totalAmount
    });
    this.confirm.emit();
  }

  onCancel() {
    console.log('=== TRANSFERT ANNULÉ - Terminer plus tard ===');
    this.cancel.emit();
  }

  onModify() {
    console.log('=== MODIFICATION DU TRANSFERT ===');
    this.modify.emit();
  }
}