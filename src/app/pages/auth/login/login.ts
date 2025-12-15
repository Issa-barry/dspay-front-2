import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { MessageModule } from 'primeng/message';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        SelectModule,
        MessageModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login implements OnInit {
    phone: string = '';
    password: string = '';
    selectedCountry: Country | null = null;
    loading: boolean = false;
    errorMessage: string = '';
    returnUrl: string = '/';

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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        // Sélectionner la France par défaut
        this.selectedCountry = this.countries[0];

        // Récupérer l'URL de retour
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/dashboard';

        // Si déjà connecté, rediriger
        if (this.authService.isAuthenticated()) {
            this.router.navigate([this.returnUrl]);
        }
    }

    isFormValid(): boolean {
        return this.phone.trim() !== '' && 
               this.password.trim() !== '' && 
               this.selectedCountry !== null &&
               !this.loading;
    }

    login(): void {
        if (!this.isFormValid() || this.loading) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        // Construire le numéro complet au format E.164
        const fullPhone = `${this.selectedCountry!.dialCode}${this.phone.replace(/\s/g, '').replace(/^0/, '')}`;
        //                                                                           ^^^^^^^^^^^^^^^ Enlever le 0 initial

        console.log('📤 LOGIN DEBUG:', {
            selectedCountry: this.selectedCountry,
            dialCode: this.selectedCountry?.dialCode,
            countryCode: this.selectedCountry?.code,
            phoneInput: this.phone,
            phoneClean: this.phone.replace(/\s/g, '').replace(/^0/, ''),
            fullPhone: fullPhone,
            password: '***' + this.password.slice(-3),
            passwordLength: this.password.length
        });

        // ✅ Passer dial_code et country_code au service
        this.authService.loginWithPhone(
            fullPhone,
            this.password,
            this.selectedCountry!.dialCode,  // ✅ dial_code
            this.selectedCountry!.code       // ✅ country_code
        ).subscribe({
            next: (response) => {
                if (response?.success) {
                    console.log('✅ Connexion réussie:', response.message);
                    console.log('👤 Utilisateur:', response.data?.user);

                    setTimeout(() => {
                        this.router.navigate([this.returnUrl]);
                    }, 500);
                } else {
                    this.errorMessage = response?.message || 'Une erreur est survenue';
                    this.loading = false;
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('❌ Erreur de connexion:', error);

                if (error.status === 401) {
                    this.errorMessage = 'Numéro de téléphone ou mot de passe incorrect.';
                } else if (error.status === 403) {
                    this.errorMessage = error.error?.message || 'Accès refusé.';
                } else if (error.status === 422) {
                    const errors = error.error?.errors || error.error?.data;
                    if (errors) {
                        this.errorMessage = Object.values(errors).flat().join(' ');
                    } else {
                        this.errorMessage = error.error?.message || 'Données invalides.';
                    }
                } else if (error.status === 503) {
                    this.errorMessage = 'Service temporairement indisponible.';
                } else if (error.status === 0) {
                    this.errorMessage = 'Impossible de se connecter au serveur.';
                } else {
                    this.errorMessage = error.error?.message || 'Une erreur est survenue.';
                }
            }
        });
    }

    /**
     * Formater le numéro pendant la saisie
     */
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
}