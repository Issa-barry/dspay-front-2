import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { VerificationService } from '@/pages/service/verification/verification.service';
 
interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

interface RegisterRequest {
    civilite?: string;
    nom: string;
    prenom: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    date_naissance?: string;
    pays: string;
    code: string;
    dial_code: string;
    adresse?: string;
    complement_adresse?: string;
    ville?: string;
    quartier?: string;
    code_postal?: string;
    region?: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    data?: any;
    errors?: any;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        SelectModule,
        MessageModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register implements OnInit {
    // Injections
    private router = inject(Router);
    private authService = inject(AuthService);
    private verificationService = inject(VerificationService);
    private messageService = inject(MessageService);

    // Step management
    currentStep: number = 0;
    
    // Form data
    phone: string = '';
    email: string = '';
    nom: string = '';
    prenom: string = '';
    password: string = '';
     
    selectedCountry: Country | null = null;
    loading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    countries: Country[] = [
        // France et DOM-TOM
        { name: 'France', code: 'FR', dialCode: '+33', flag: 'https://flagcdn.com/fr.svg' },
        { name: 'Mayotte', code: 'YT', dialCode: '+262', flag: 'https://flagcdn.com/yt.svg' },
        { name: 'La Réunion', code: 'RE', dialCode: '+262', flag: 'https://flagcdn.com/re.svg' },
        { name: 'Guadeloupe', code: 'GP', dialCode: '+590', flag: 'https://flagcdn.com/gp.svg' },
        { name: 'Martinique', code: 'MQ', dialCode: '+596', flag: 'https://flagcdn.com/mq.svg' },
        { name: 'Guyane française', code: 'GF', dialCode: '+594', flag: 'https://flagcdn.com/gf.svg' },
        { name: 'Saint-Martin', code: 'MF', dialCode: '+590', flag: 'https://flagcdn.com/mf.svg' },
        { name: 'Saint-Barthélemy', code: 'BL', dialCode: '+590', flag: 'https://flagcdn.com/bl.svg' },
        { name: 'Saint-Pierre-et-Miquelon', code: 'PM', dialCode: '+508', flag: 'https://flagcdn.com/pm.svg' },
        { name: 'Wallis-et-Futuna', code: 'WF', dialCode: '+681', flag: 'https://flagcdn.com/wf.svg' },
        { name: 'Nouvelle-Calédonie', code: 'NC', dialCode: '+687', flag: 'https://flagcdn.com/nc.svg' },
        { name: 'Polynésie française', code: 'PF', dialCode: '+689', flag: 'https://flagcdn.com/pf.svg' },
        
        // Europe
        { name: 'Grèce', code: 'GR', dialCode: '+30', flag: 'https://flagcdn.com/gr.svg' },
        { name: 'Pays-Bas', code: 'NL', dialCode: '+31', flag: 'https://flagcdn.com/nl.svg' },
        { name: 'Belgique', code: 'BE', dialCode: '+32', flag: 'https://flagcdn.com/be.svg' },
        { name: 'Espagne', code: 'ES', dialCode: '+34', flag: 'https://flagcdn.com/es.svg' },
        { name: 'Hongrie', code: 'HU', dialCode: '+36', flag: 'https://flagcdn.com/hu.svg' },
        { name: 'Italie', code: 'IT', dialCode: '+39', flag: 'https://flagcdn.com/it.svg' },
        { name: 'Roumanie', code: 'RO', dialCode: '+40', flag: 'https://flagcdn.com/ro.svg' },
        { name: 'Suisse', code: 'CH', dialCode: '+41', flag: 'https://flagcdn.com/ch.svg' },
        { name: 'Autriche', code: 'AT', dialCode: '+43', flag: 'https://flagcdn.com/at.svg' },
        { name: 'Royaume-Uni', code: 'GB', dialCode: '+44', flag: 'https://flagcdn.com/gb.svg' },
        { name: 'Jersey', code: 'JE', dialCode: '+44', flag: 'https://flagcdn.com/je.svg' },
        { name: 'Guernesey', code: 'GG', dialCode: '+44', flag: 'https://flagcdn.com/gg.svg' },
        { name: 'Danemark', code: 'DK', dialCode: '+45', flag: 'https://flagcdn.com/dk.svg' },
        { name: 'Suède', code: 'SE', dialCode: '+46', flag: 'https://flagcdn.com/se.svg' },
        { name: 'Pologne', code: 'PL', dialCode: '+48', flag: 'https://flagcdn.com/pl.svg' },
        { name: 'Allemagne', code: 'DE', dialCode: '+49', flag: 'https://flagcdn.com/de.svg' },
        { name: 'Portugal', code: 'PT', dialCode: '+351', flag: 'https://flagcdn.com/pt.svg' },
        { name: 'Luxembourg', code: 'LU', dialCode: '+352', flag: 'https://flagcdn.com/lu.svg' },
        { name: 'Irlande', code: 'IE', dialCode: '+353', flag: 'https://flagcdn.com/ie.svg' },
        { name: 'Malte', code: 'MT', dialCode: '+356', flag: 'https://flagcdn.com/mt.svg' },
        { name: 'Chypre', code: 'CY', dialCode: '+357', flag: 'https://flagcdn.com/cy.svg' },
        { name: 'Finlande', code: 'FI', dialCode: '+358', flag: 'https://flagcdn.com/fi.svg' },
        { name: 'Bulgarie', code: 'BG', dialCode: '+359', flag: 'https://flagcdn.com/bg.svg' },
        { name: 'Lituanie', code: 'LT', dialCode: '+370', flag: 'https://flagcdn.com/lt.svg' },
        { name: 'Lettonie', code: 'LV', dialCode: '+371', flag: 'https://flagcdn.com/lv.svg' },
        { name: 'Estonie', code: 'EE', dialCode: '+372', flag: 'https://flagcdn.com/ee.svg' },
        { name: 'Croatie', code: 'HR', dialCode: '+385', flag: 'https://flagcdn.com/hr.svg' },
        { name: 'Tchéquie', code: 'CZ', dialCode: '+420', flag: 'https://flagcdn.com/cz.svg' },
        { name: 'Slovaquie', code: 'SK', dialCode: '+421', flag: 'https://flagcdn.com/sk.svg' },
        
        // Afrique francophone
        { name: 'Guinée', code: 'GN', dialCode: '+224', flag: 'https://flagcdn.com/gn.svg' },
        { name: 'Sénégal', code: 'SN', dialCode: '+221', flag: 'https://flagcdn.com/sn.svg' },
        { name: 'Mali', code: 'ML', dialCode: '+223', flag: 'https://flagcdn.com/ml.svg' },
        { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225', flag: 'https://flagcdn.com/ci.svg' },
    ];

    ngOnInit(): void {
        // Sélectionner la France par défaut
        this.selectedCountry = this.countries[0];

        console.log('🔧 Register initialisé');
    }

    // Navigation
    nextStep(): void {
        if (this.canProceed()) {
            this.currentStep++;
            this.errorMessage = '';
        }
    }

    previousStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.errorMessage = '';
        }
    }

    // Validation par étape
    canProceed(): boolean {
        switch (this.currentStep) {
            case 0: // Phone
                return this.phone.trim() !== '' && this.selectedCountry !== null;
            case 1: // Email
                return this.email.trim() !== '' && this.isValidEmail(this.email);
            case 2: // Name
                return this.nom.trim() !== '' && this.prenom.trim() !== '';
            case 3: // Password
                return this.isStep4Valid();
            default:
                return false;
        }
    }

    isStep4Valid(): boolean {
        return this.password.length >= 8;
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Formatage téléphone
    formatPhoneInput(event: any): void {
        let value = event.target.value.replace(/\D/g, '');
        
        if (this.selectedCountry?.code === 'GN') {
            // Guinée: XXX XX XX XX
            if (value.length > 3 && value.length <= 5) {
                value = `${value.slice(0, 3)} ${value.slice(3)}`;
            } else if (value.length > 5 && value.length <= 7) {
                value = `${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5)}`;
            } else if (value.length > 7) {
                value = `${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 7)} ${value.slice(7, 9)}`;
            }
        } else if (this.selectedCountry?.code === 'FR') {
            // France: XX XX XX XX XX
            if (value.length > 2) {
                value = value.match(/.{1,2}/g)?.join(' ') || value;
            }
        }

        this.phone = value;
    }

    // Soumission
    submitRegistration(): void {
        if (!this.isStep4Valid() || this.loading) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Construire le phone au format E.164
        const cleanPhone = this.phone.replace(/\s/g, '').replace(/^0/, '');
        const fullPhone = `${this.selectedCountry!.dialCode}${cleanPhone}`;

        const registerData: RegisterRequest = {
            nom: this.nom.trim(),
            prenom: this.prenom.trim(),
            email: this.email.trim().toLowerCase(),
            phone: fullPhone,
            password: this.password,
            password_confirmation: this.password,
            pays: this.selectedCountry!.name,
            code: this.selectedCountry!.code,
            dial_code: this.selectedCountry!.dialCode
        };

        console.log('📤 Envoi des données d\'inscription:', {
            ...registerData,
            password: '***',
            password_confirmation: '***'
        });

        // ✅ Appeler authService.register()
        this.authService.register(registerData).subscribe({
            next: (response) => {
                console.log('✅ Réponse inscription:', response);

                if (response.success) {
                    this.successMessage = response.message || 'Compte créé avec succès !';
                    
                    // Afficher un toast de succès
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Inscription réussie',
                        detail: 'Un code de vérification a été envoyé à votre email.',
                        life: 3000
                    });

                    const emailToSave = this.email.trim().toLowerCase();
                    console.log('📧 Email à sauvegarder:', emailToSave);

                    // ✅ CRITIQUE : Enregistrer l'email dans le service de vérification
                    this.verificationService.setVerificationData(emailToSave);
                    
                    // Vérifier que l'email a bien été sauvegardé
                    const savedEmail = this.verificationService.getVerificationEmail();
                    console.log('✅ Email vérifié dans le service:', savedEmail);

                    if (savedEmail === emailToSave) {
                        console.log('✅ Email correctement enregistré');
                    } else {
                        console.error('❌ Erreur: Email non enregistré correctement');
                    }

                    // Rediriger après un délai pour que l'utilisateur voie le message
                    setTimeout(() => {
                        console.log('🔄 Navigation vers /auth/verification');
                        this.router.navigate(['/auth/verification']).then(success => {
                            if (success) {
                                console.log('✅ Navigation réussie');
                            } else {
                                console.error('❌ Échec de navigation');
                            }
                        });
                    }, 1500);

                } else {
                    this.errorMessage = response.message || 'Une erreur est survenue';
                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: this.errorMessage,
                        life: 5000
                    });
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('❌ Erreur inscription:', error);

                if (error.status === 422) {
                    // Erreurs de validation
                    const errors = error.error?.errors || error.error?.data;
                    if (errors) {
                        // Afficher chaque erreur
                        Object.keys(errors).forEach(field => {
                            const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
                            messages.forEach((msg: string) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: `Erreur - ${field}`,
                                    detail: msg,
                                    life: 5000
                                });
                            });
                        });

                        // Message général
                        const errorMessages = Object.values(errors).flat();
                        this.errorMessage = (errorMessages as string[]).join(' ');
                    } else {
                        this.errorMessage = error.error?.message || 'Données invalides.';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur de validation',
                            detail: this.errorMessage,
                            life: 5000
                        });
                    }
                } else if (error.status === 500) {
                    this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur serveur',
                        detail: this.errorMessage,
                        life: 5000
                    });
                } else if (error.status === 0) {
                    this.errorMessage = 'Impossible de se connecter au serveur.';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de connexion',
                        detail: this.errorMessage,
                        life: 5000
                    });
                } else {
                    this.errorMessage = error.error?.message || 'Une erreur est survenue.';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: this.errorMessage,
                        life: 5000
                    });
                }
            }
        });
    }
}