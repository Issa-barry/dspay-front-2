import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeroSendForm } from '../components/hero-send-form/hero-send-form';

interface Stat {
  value: string;
  label: string;
}

interface Badge {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HeroSendForm],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('statsBar') statsBar!: ElementRef;

  stats: Stat[] = [
    { value: '50K+', label: 'Transferts réussis' },
    { value: '30+', label: 'Pays desservis' },
    { value: '24/7', label: 'Support client' },
    { value: '< 30min', label: 'Temps de transfert' }
  ];

  badges: Badge[] = [
    { icon: 'pi-shield', text: 'Transfert instantané' },
    { icon: 'pi-lock', text: 'Données cryptées' },
    { icon: 'pi-verified', text: 'Dépôt direct sur wallet' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Vérifier la visibilité initiale au cas où la section est déjà visible
    this.checkStatsVisibility();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkStatsVisibility();
  }

  private checkStatsVisibility(): void {
    if (!this.statsBar) return;

    const statsElement = this.statsBar.nativeElement;
    const rect = statsElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Ajouter la classe 'visible' si l'élément est dans le viewport (80% de visibilité)
    if (rect.top <= windowHeight * 0.8) {
      statsElement.classList.add('visible');
    }
  }

  // Ajouter ces méthodes dans la classe HeroComponent

trackByStat(index: number, stat: Stat): string {
  return stat.value;
}

trackByBadge(index: number, badge: Badge): string {
  return badge.icon;
}
}