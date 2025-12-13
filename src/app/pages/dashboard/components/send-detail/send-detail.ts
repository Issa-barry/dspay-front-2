import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface TransferDetail {
  id: string;
  date: Date;
  montant: number;
  devise: string;
  montantConverti: number;
  deviseDestination: string;
  tauxChange: number;
  frais: number;
  montantTotal: number;
  beneficiaire: {
    nom: string;
    prenom: string;
    telephone: string;
    pays: string;
  };
  methodePaiement: string;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'echoue';
  reference: string;
}

@Component({
  selector: 'app-send-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './send-detail.html',
  styleUrl: './send-detail.scss'
})
export class SendDetail implements OnInit {
  transfer: TransferDetail = {
    id: '1',
    date: new Date(),
    montant: 100,
    devise: 'EUR',
    montantConverti: 950000,
    deviseDestination: 'GNF',
    tauxChange: 9500,
    frais: 2.5,
    montantTotal: 102.5,
    beneficiaire: {
      nom: 'Diallo',
      prenom: 'Mamadou',
      telephone: '+224 621 00 00 00',
      pays: 'Guinée'
    },
    methodePaiement: 'Orange Money',
    statut: 'termine',
    reference: 'TRF-2024-001234'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les détails du transfert depuis l'API
    const transferId = this.route.snapshot.paramMap.get('id');
    // TODO: Appeler votre service API
  }

  getStatutClass(): string {
    const classes = {
      'en_attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'en_cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'termine': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'echoue': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return classes[this.transfer.statut];
  }

  getStatutText(): string {
    const textes = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'echoue': 'Échoué'
    };
    return textes[this.transfer.statut];
  }

  telechargerRecu(): void {
    // TODO: Implémenter le téléchargement du reçu
    console.log('Télécharger le reçu');
  }

  partagerTransfert(): void {
    // TODO: Implémenter le partage
    console.log('Partager le transfert');
  }

  retour(): void {
    this.router.navigate(['/app/history']);
  }
}