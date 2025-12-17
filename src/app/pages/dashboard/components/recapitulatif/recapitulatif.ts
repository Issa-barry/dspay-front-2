import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recapitulatif',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss'
})
export class RecapitulatifComponent implements OnInit {

  // 🔹 Champs ALIGNÉS BACK
  @Input() montant_envoie: number = 0;      // EUR
  @Input() amount: number = 0;              // GNF
  @Input() frais: number = 0;
  @Input() total_ttc: number = 0;

  @Input() beneficiaire_nom: string = '';
  @Input() service_libelle: string = '';
  @Input() point_retrait: string = 'Dabompa Tamisso';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() modify = new EventEmitter<void>();

  ngOnInit() {
    console.log('=== RÉCAPITULATIF (BACK-ALIGNED) ===');
    console.table({
      montant_envoie: this.montant_envoie,
      amount: this.amount,
      frais: this.frais,
      total_ttc: this.total_ttc,
      beneficiaire_nom: this.beneficiaire_nom,
      service_libelle: this.service_libelle,
      point_retrait: this.point_retrait,
    });
  }

  onConfirm() {
    console.log('=== CONFIRMATION DU TRANSFERT ===');
    console.table({
      montant_envoie: this.montant_envoie,
      amount: this.amount,
      frais: this.frais,
      total_ttc: this.total_ttc,
      beneficiaire_nom: this.beneficiaire_nom,
      service_libelle: this.service_libelle,
      point_retrait: this.point_retrait,
    });

    this.confirm.emit();
  }

  onCancel() {
    console.log('=== TRANSFERT ANNULÉ ===');
    this.cancel.emit();
  }

  onModify() {
    console.log('=== MODIFICATION DU TRANSFERT ===');
    this.modify.emit();
  }
}
