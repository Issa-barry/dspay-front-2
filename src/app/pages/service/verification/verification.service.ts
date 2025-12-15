import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface VerificationData {
  email: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private readonly STORAGE_KEY = 'verification_data';
  private readonly EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

  private verificationData$ = new BehaviorSubject<VerificationData | null>(this.loadFromStorage());

  constructor() {
    // Nettoyer les données expirées au démarrage
    this.cleanExpiredData();
  }

  /**
   * Définir les données de vérification
   */
  setVerificationData(email: string): void {
    const data: VerificationData = {
      email,
      timestamp: Date.now()
    };

    this.verificationData$.next(data);
    this.saveToStorage(data);
    
    console.log('✅ Données de vérification enregistrées:', { email });
  }

  /**
   * Obtenir les données de vérification
   */
  getVerificationData(): VerificationData | null {
    const data = this.verificationData$.value;

    // Vérifier si les données ont expiré
    if (data && this.isExpired(data)) {
      console.warn('⚠️ Données de vérification expirées');
      this.clearVerificationData();
      return null;
    }

    return data;
  }

  /**
   * Obtenir l'email de vérification
   */
  getVerificationEmail(): string | null {
    const data = this.getVerificationData();
    return data?.email || null;
  }

  /**
   * Observer les données de vérification
   */
  getVerificationData$(): Observable<VerificationData | null> {
    return this.verificationData$.asObservable();
  }

  /**
   * Vérifier si des données de vérification existent
   */
  hasVerificationData(): boolean {
    return this.getVerificationData() !== null;
  }

  /**
   * Effacer les données de vérification
   */
  clearVerificationData(): void {
    this.verificationData$.next(null);
    this.removeFromStorage();
    console.log('🧹 Données de vérification effacées');
  }

  /**
   * Vérifier si les données ont expiré
   */
  private isExpired(data: VerificationData): boolean {
    const elapsed = Date.now() - data.timestamp;
    return elapsed > this.EXPIRY_TIME;
  }

  /**
   * Nettoyer les données expirées
   */
  private cleanExpiredData(): void {
    const data = this.loadFromStorage();
    if (data && this.isExpired(data)) {
      this.removeFromStorage();
      console.log('🧹 Données expirées nettoyées au démarrage');
    }
  }

  /**
   * Sauvegarder dans le localStorage
   */
  private saveToStorage(data: VerificationData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('❌ Erreur sauvegarde données vérification:', error);
    }
  }

  /**
   * Charger depuis le localStorage
   */
  private loadFromStorage(): VerificationData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as VerificationData;
      
      // Vérifier si expiré
      if (this.isExpired(data)) {
        this.removeFromStorage();
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur lecture données vérification:', error);
      return null;
    }
  }

  /**
   * Supprimer du localStorage
   */
  private removeFromStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('❌ Erreur suppression données vérification:', error);
    }
  }
}