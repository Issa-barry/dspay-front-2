import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { SendService } from '@/pages/service/send/send.service';
import { SendModel } from 'src/app/core/models/send.model';

import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

type Severity = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TagModule, TooltipModule, SkeletonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent implements OnInit, OnDestroy {
  displayedTransfers: SendModel[] = [];

  searchQuery = '';
  readonly itemsPerPage = 10;

  private currentPage = 1;
  hasMore = true;
  loading = false;

  private readonly sub = new Subscription();
  private searchTimer: any;

  private static readonly STATUS_LABELS: Record<string, string> = {
    envoye: 'Envoyé',
    retire: 'Retiré',
    annule: 'Annulé',
    bloque: 'Bloqué',
  };

  private static readonly STATUS_SEVERITIES: Record<string, Severity> = {
    envoye: 'info',
    retire: 'success',
    annule: 'danger',
    bloque: 'danger',
  };

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly sendService: SendService
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
    this.sub.unsubscribe();
  }

  onSearchInput(value: string): void {
    this.searchQuery = (value ?? '').trim();

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.reload();
    }, 350);
  }

  reload(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.fetch(1, false);
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.fetch(this.currentPage + 1, true);
  }

  private fetch(page: number, append: boolean): void {
    if (this.loading) return;
    this.loading = true;

    const q = this.searchQuery.trim();
    const search = q.length >= 2 ? q : undefined;

    this.sub.add(
      this.sendService.getMyTransfers({
        search,
        page,
        per_page: this.itemsPerPage,
        sort_by: 'created_at',
        sort_dir: 'desc',
      }).subscribe({
        next: (res) => {
          const items = res.items ?? [];
          this.displayedTransfers = append ? this.displayedTransfers.concat(items) : items;

          this.currentPage = res.meta?.current_page ?? page;
          const lastPage = res.meta?.last_page ?? page;
          this.hasMore = this.currentPage < lastPage;

          this.loading = false;
        },
        error: () => {
          if (!append) this.displayedTransfers = [];
          this.hasMore = false;
          this.loading = false;
        },
      })
    );
  }

  goBack(): void {
     this.router.navigate(['/app']);
  }

  viewDetails(transfer: SendModel): void {
    if (!transfer?.id) return;
    this.router.navigate(['/app/detail', transfer.id]);
  }

  trackByTransferId = (_: number, t: SendModel) => t.id ?? t.code ?? _;

  getStatusLabel(statut?: string): string {
    const s = this.normalizeStatut(statut);
    return HistoryComponent.STATUS_LABELS[s] ?? (statut ?? '—');
  }

  getStatusSeverity(statut?: string): Severity {
    const s = this.normalizeStatut(statut);
    return HistoryComponent.STATUS_SEVERITIES[s] ?? 'warning';
  }

  private normalizeStatut(value?: string): string {
    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  formatAmount(amount?: number): string {
    const n = Number(amount ?? 0);
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);
  }

  formatDate(value?: string | Date): string {
    const d = value instanceof Date ? value : new Date(value ?? Date.now());
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  }
}
