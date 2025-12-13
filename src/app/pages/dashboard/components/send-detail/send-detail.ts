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
    try {
      // Générer le contenu HTML du reçu
      const recuHTML = this.genererRecuHTML();
      
      // Créer un blob à partir du HTML
      const blob = new Blob([recuHTML], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `Recu_${this.transfer.reference}.html`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Informer l'utilisateur
      setTimeout(() => {
        alert('Reçu téléchargé ! Vous pouvez l\'imprimer en PDF depuis votre navigateur (Ctrl+P → Enregistrer en PDF)');
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
      alert('Une erreur est survenue lors de la génération du reçu.');
    }
  }

  async partagerTransfert(): Promise<void> {
    try {
      // Générer le contenu HTML du reçu
      const recuHTML = this.genererRecuHTML();
      
      // Créer un blob HTML
      const htmlBlob = new Blob([recuHTML], { type: 'text/html;charset=utf-8' });
      
      // Créer un fichier à partir du blob
      const file = new File(
        [htmlBlob], 
        `Recu_${this.transfer.reference}.html`, 
        { type: 'text/html' }
      );
      
      // Vérifier si l'API Web Share est disponible et supporte les fichiers
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Reçu DSPAY - ${this.transfer.reference}`,
          text: `Transfert de ${this.transfer.montant} ${this.transfer.devise} vers ${this.transfer.beneficiaire.prenom} ${this.transfer.beneficiaire.nom}`,
          files: [file]
        });
      } else {
        // Fallback : télécharger le fichier si le partage n'est pas supporté
        const url = window.URL.createObjectURL(htmlBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Recu_${this.transfer.reference}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert('Le partage direct n\'est pas supporté sur cet appareil. Le reçu a été téléchargé.');
      }
      
    } catch (error: any) {
      // Si l'utilisateur annule le partage
      if (error.name === 'AbortError') {
        console.log('Partage annulé par l\'utilisateur');
        return;
      }
      
      console.error('Erreur lors du partage:', error);
      
      // Fallback : télécharger le fichier
      try {
        const recuHTML = this.genererRecuHTML();
        const blob = new Blob([recuHTML], { type: 'text/html;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Recu_${this.transfer.reference}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert('Le partage a échoué. Le reçu a été téléchargé à la place.');
      } catch (downloadError) {
        alert('Une erreur est survenue lors du partage du reçu.');
      }
    }
  }

  genererRecuHTML(): string {
    const dateFormatee = this.transfer.date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const heureFormatee = this.transfer.date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reçu - ${this.transfer.reference}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 20px;
    }
    
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 40px 30px;
      position: relative;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    
    .header-subtitle {
      opacity: 0.95;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .reference-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .reference-text {
      font-size: 13px;
      opacity: 0.9;
    }
    
    .statut-badge {
      background: rgba(255, 255, 255, 0.25);
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    
    .montant-principal {
      margin-top: 25px;
    }
    
    .montant-label {
      opacity: 0.9;
      font-size: 13px;
      margin-bottom: 8px;
      display: block;
    }
    
    .montant-value {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: -1px;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .info-block {
      background: #f9fafb;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .info-label {
      color: #6b7280;
      font-size: 14px;
    }
    
    .info-value {
      font-weight: 600;
      color: #111827;
      text-align: right;
    }
    
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #22c55e;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .section-title svg {
      width: 22px;
      height: 22px;
      margin-right: 10px;
    }
    
    .conversion-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #22c55e;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 25px 0;
    }
    
    .taux-change {
      color: #047857;
      font-size: 14px;
      margin-bottom: 18px;
      font-weight: 500;
    }
    
    .montant-converti {
      font-size: 38px;
      font-weight: bold;
      color: #15803d;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .montant-converti-label {
      color: #059669;
      font-size: 13px;
      font-weight: 500;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .detail-label {
      color: #6b7280;
      font-size: 14px;
    }
    
    .detail-value {
      font-weight: 500;
      color: #111827;
    }
    
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 20px 0;
    }
    
    .total-row {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    
    .total-label {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    
    .total-value {
      font-size: 24px;
      font-weight: bold;
      color: #15803d;
    }
    
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-title {
      font-weight: 600;
      color: #111827;
      margin-bottom: 10px;
      font-size: 15px;
    }
    
    .footer-text {
      color: #6b7280;
      font-size: 13px;
      margin: 5px 0;
    }
    
    .footer-brand {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #9ca3af;
      font-size: 12px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .page-container {
        box-shadow: none;
        max-width: 100%;
      }
      
      @page {
        margin: 0;
        size: A4;
      }
    }
    
    @media screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .logo {
        font-size: 28px;
      }
      
      .montant-value {
        font-size: 36px;
      }
      
      .montant-converti {
        font-size: 32px;
      }
      
      .reference-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    
    <!-- En-tête -->
    <div class="header">
      <div class="header-content">
        <div class="logo">DSPAY</div>
        <div class="header-subtitle">Reçu de transfert d'argent</div>
        
        <div class="reference-row">
          <div class="reference-text">Référence: ${this.transfer.reference}</div>
          <div class="statut-badge">${this.getStatutText()}</div>
        </div>
        
        <div class="montant-principal">
          <span class="montant-label">Montant envoyé</span>
          <div class="montant-value">${this.transfer.montant} ${this.transfer.devise}</div>
        </div>
      </div>
    </div>
    
    <!-- Contenu principal -->
    <div class="content">
      
      <!-- Date et heure -->
      <div class="info-block">
        <span class="info-label">Date et heure</span>
        <span class="info-value">${dateFormatee} à ${heureFormatee}</span>
      </div>
      
      <!-- Conversion -->
      <div class="section">
        <div class="section-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
          </svg>
          Détails de la conversion
        </div>
        
        <div class="conversion-box">
          <div class="taux-change">
            Taux de change: 1 ${this.transfer.devise} = ${this.transfer.tauxChange.toLocaleString('fr-FR')} ${this.transfer.deviseDestination}
          </div>
          <div class="montant-converti">${this.transfer.montantConverti.toLocaleString('fr-FR')} ${this.transfer.deviseDestination}</div>
          <div class="montant-converti-label">Montant reçu par le bénéficiaire</div>
        </div>
      </div>
      
      <!-- Bénéficiaire -->
      <div class="section">
        <div class="section-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Bénéficiaire
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Nom complet</span>
          <span class="detail-value">${this.transfer.beneficiaire.prenom} ${this.transfer.beneficiaire.nom}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Téléphone</span>
          <span class="detail-value">${this.transfer.beneficiaire.telephone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Pays</span>
          <span class="detail-value">${this.transfer.beneficiaire.pays}</span>
        </div>
      </div>
      
      <!-- Détails du paiement -->
      <div class="section">
        <div class="section-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          Détails du paiement
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Méthode de paiement</span>
          <span class="detail-value">${this.transfer.methodePaiement}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="detail-row">
          <span class="detail-label">Montant</span>
          <span class="detail-value">${this.transfer.montant} ${this.transfer.devise}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Frais de service</span>
          <span class="detail-value">${this.transfer.frais} ${this.transfer.devise}</span>
        </div>
        
        <div class="total-row">
          <span class="total-label">Total payé</span>
          <span class="total-value">${this.transfer.montantTotal} ${this.transfer.devise}</span>
        </div>
      </div>
      
    </div>
    
    <!-- Pied de page -->
    <div class="footer">
      <div class="footer-title">Besoin d'aide ?</div>
      <div class="footer-text">Contactez notre service client au <strong>+224 xxx xx xx xx</strong></div>
      <div class="footer-text">Email: <strong>support@dspay.com</strong></div>
      <div class="footer-brand">DSPAY - Service de transfert d'argent en Guinée-Conakry</div>
    </div>
    
  </div>
</body>
</html>
    `;
  }

  retour(): void {
    this.router.navigate(['/app/history']);
  }
}