import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
 
interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
   ],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq implements OnInit {
  faqs: FAQItem[] = [];
  filteredFaqs: FAQItem[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  
  categories: FAQCategory[] = [
    { name: 'all', icon: 'pi-list', count: 0 },
    { name: 'Transfert', icon: 'pi-send', count: 0 },
    { name: 'Compte', icon: 'pi-user', count: 0 },
    { name: 'Paiement', icon: 'pi-credit-card', count: 0 },
    { name: 'Sécurité', icon: 'pi-shield', count: 0 }
  ];

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadFaqs();
    this.updateCategoryCounts();
  }

  loadFaqs() {
    this.faqs = [
      // Transfert
      {
        id: 1,
        category: 'Transfert',
        question: 'Comment effectuer un transfert d\'argent ?',
        answer: 'Pour effectuer un transfert : 1) Connectez-vous à votre compte, 2) Cliquez sur "Nouveau transfert", 3) Sélectionnez le bénéficiaire ou ajoutez-en un nouveau, 4) Entrez le montant en EUR, 5) Choisissez le mode de réception (Orange Money, MTN, KS-PAY, Soutrat Money), 6) Confirmez et effectuez le paiement.'
      },
      {
        id: 2,
        category: 'Transfert',
        question: 'Quel est le taux de change EUR/GNF ?',
        answer: 'Le taux de change actuel est de 1 EUR = 9 500 GNF. Ce taux est mis à jour régulièrement et s\'affiche automatiquement lors de votre transfert. Vous pouvez consulter le taux en temps réel sur notre page d\'accueil.'
      },
      {
        id: 3,
        category: 'Transfert',
        question: 'Combien de temps prend un transfert ?',
        answer: 'Les transferts sont généralement traités instantanément. Le bénéficiaire reçoit l\'argent dans les 5 à 30 minutes suivant votre paiement. En cas de retard exceptionnel, le délai maximum est de 24 heures.'
      },
      {
        id: 4,
        category: 'Transfert',
        question: 'Quel est le montant minimum et maximum par transfert ?',
        answer: 'Le montant minimum par transfert est de 10 EUR et le montant maximum est de 3 000 EUR par transaction. Pour des montants supérieurs, vous pouvez effectuer plusieurs transferts ou nous contacter pour une demande spéciale.'
      },
      {
        id: 5,
        category: 'Transfert',
        question: 'Puis-je annuler un transfert ?',
        answer: 'Une fois le paiement validé, le transfert ne peut pas être annulé car il est traité immédiatement. Si vous avez fait une erreur, contactez notre service client dans les plus brefs délais avec votre numéro de référence.'
      },
      
      // Compte
      {
        id: 6,
        category: 'Compte',
        question: 'Comment créer un compte ?',
        answer: 'Cliquez sur "S\'inscrire" en haut de la page, remplissez le formulaire avec vos informations (nom, prénom, email, téléphone) et créez un mot de passe sécurisé. Vous recevrez un email de confirmation pour activer votre compte.'
      },
      {
        id: 7,
        category: 'Compte',
        question: 'Comment réinitialiser mon mot de passe ?',
        answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?", entrez votre adresse email, et vous recevrez un lien pour réinitialiser votre mot de passe. Le lien est valide pendant 24 heures.'
      },
      {
        id: 8,
        category: 'Compte',
        question: 'Comment modifier mes informations personnelles ?',
        answer: 'Connectez-vous à votre compte, allez dans "Paramètres" ou "Mon profil", puis cliquez sur "Modifier". Vous pouvez mettre à jour votre nom, téléphone, adresse email et autres informations. N\'oubliez pas de sauvegarder vos modifications.'
      },
      {
        id: 9,
        category: 'Compte',
        question: 'Comment supprimer mon compte ?',
        answer: 'Pour supprimer votre compte, contactez notre service client via email ou téléphone. Pour des raisons de sécurité et de conformité, nous devons vérifier votre identité avant de procéder à la suppression définitive de votre compte.'
      },
      
      // Paiement
      {
        id: 10,
        category: 'Paiement',
        question: 'Quels modes de paiement sont acceptés ?',
        answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Apple Pay et Google Pay. Tous les paiements sont sécurisés et cryptés.'
      },
      {
        id: 11,
        category: 'Paiement',
        question: 'Y a-t-il des frais de transaction ?',
        answer: 'Oui, des frais de service s\'appliquent selon le montant du transfert : 2% pour les montants de 10 à 100 EUR, 1,5% pour 100 à 500 EUR, et 1% pour plus de 500 EUR. Les frais sont clairement affichés avant la confirmation du transfert.'
      },
      {
        id: 12,
        category: 'Paiement',
        question: 'Mon paiement a échoué, que faire ?',
        answer: 'Vérifiez d\'abord que votre carte est activée pour les paiements en ligne et qu\'elle dispose de fonds suffisants. Si le problème persiste, contactez votre banque ou essayez un autre mode de paiement. Vous pouvez aussi nous contacter pour assistance.'
      },
      {
        id: 13,
        category: 'Paiement',
        question: 'Puis-je obtenir un reçu ou une facture ?',
        answer: 'Oui, après chaque transfert, vous recevez automatiquement un reçu par email. Vous pouvez également télécharger vos reçus depuis l\'historique de vos transactions dans votre espace client.'
      },
      
      // Sécurité
      {
        id: 14,
        category: 'Sécurité',
        question: 'Comment sont sécurisées mes transactions ?',
        answer: 'Toutes vos transactions sont protégées par un cryptage SSL/TLS 256 bits. Nous utilisons également l\'authentification 3D Secure pour les paiements par carte et ne stockons jamais vos informations bancaires complètes sur nos serveurs.'
      },
      {
        id: 15,
        category: 'Sécurité',
        question: 'Mes données personnelles sont-elles protégées ?',
        answer: 'Oui, nous respectons le RGPD et toutes les réglementations sur la protection des données. Vos informations personnelles sont cryptées, stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement.'
      },
      {
        id: 16,
        category: 'Sécurité',
        question: 'Que faire si je suspecte une activité frauduleuse ?',
        answer: 'Contactez immédiatement notre service client au +33 X XX XX XX XX ou par email à security@dspay.com. Changez votre mot de passe et activez l\'authentification à deux facteurs si ce n\'est pas déjà fait.'
      },
      {
        id: 17,
        category: 'Sécurité',
        question: 'Qu\'est-ce que l\'authentification à deux facteurs ?',
        answer: 'L\'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire à votre compte. Après avoir entré votre mot de passe, vous devrez fournir un code temporaire envoyé par SMS ou généré par une application d\'authentification.'
      }
    ];

    this.applyFilters();
  }

  updateCategoryCounts() {
    this.categories.forEach(cat => {
      if (cat.name === 'all') {
        cat.count = this.faqs.length;
      } else {
        cat.count = this.faqs.filter(faq => faq.category === cat.name).length;
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.faqs];

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
      );
    }

    this.filteredFaqs = filtered;
  }

  goBack() {
    this.location.back();
  }

  getCategoryLabel(categoryName: string): string {
    const labels: { [key: string]: string } = {
      'all': 'Toutes les catégories',
      'Transfert': 'Transfert',
      'Compte': 'Compte',
      'Paiement': 'Paiement',
      'Sécurité': 'Sécurité'
    };
    return labels[categoryName] || categoryName;
  }
}