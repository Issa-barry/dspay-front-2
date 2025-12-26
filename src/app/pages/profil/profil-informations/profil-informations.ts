import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-profil-informations',
  standalone: true,
  imports: [
    CommonModule,
  FormsModule,        // ✅ Pour ngModel
  ButtonModule,       // ✅ Pour p-button
  InputTextModule],
  templateUrl: './profil-informations.html',
  styleUrl: './profil-informations.scss'
})
export class ProfilInformations {
  // User data
  user = {
    fullName: 'Ibrahima Sory Dialla',
    phone: '+33 6 12 34 56 78',
    email: 'iba@example.com',
    country: 'France',
    address: '123 Rue de la République',
    postalCode: '75001',
    city: 'Paris'
  };

  /**
   * Obtenir les initiales à partir du nom complet
   */
  getInitials(fullName: string): string {
    if (!fullName) return '';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    
    return firstInitial + lastInitial;
  }

  /**
   * Générer une couleur de fond basée sur le nom
   */
  getAvatarColor(fullName: string): string {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981', // green
      '#6366F1', // indigo
      '#EF4444', // red
      '#14B8A6', // teal
    ];
    
    if (!fullName) return colors[0];
    
    const hash = fullName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    return colors[hash % colors.length];
  }
}