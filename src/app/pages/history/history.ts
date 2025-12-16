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

import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, filter } from 'rxjs/operators';

type Severity = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TagModule, TooltipModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class HistoryComponent implements OnInit, OnDestroy {
  displayedTransfers: SendModel[] = [];

  searchQuery = '';
  readonly itemsPerPage = 10;

  private currentPage = 1;
  hasMore = true;
  loading = false;

  private readonly search$ = new Subject<string>();
  private readonly sub = new Subscription();

  private static readonly STATUS_LABELS: Record<string, string> = {
    envoye: 'Envoyé',
    retire: 'Retiré',
    annule: 'Annulé',
    bloque: 'Bloqué'
  };

  private static readonly STATUS_SEVERITIES: Record<string, Severity> = {
    envoye: 'info',
    retire: 'success',
    annule: 'danger',
    bloque: 'danger'
  };

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly sendService: SendService
  ) {}

  ngOnInit(): void {
    // ✅ flux recherche
    this.sub.add(
      this.search$.pipe(
        map(v => (v ?? '').trim()),
        debounceTime(350),
        distinctUntilChanged(),

        // ✅ si 1 seul caractère, on ne lance pas de requête (tu gardes la liste actuelle)
        filter(q => q.length === 0 || q.length >= 2),

        tap(q => {
          this.searchQuery = q;
          this.currentPage = 1;
          this.hasMore = true;
          this.loading = true;
        }),

        // ✅ annule la requête précédente si on retape
        switchMap(q =>
          this.sendService.getMyTransfers({
            search: q.length ? q : undefined,
            page: 1,
            per_page: this.itemsPerPage,
            sort_by: 'created_at',
            sort_dir: 'desc'
          }).pipe(
            catchError(() => of({ items: [], meta: { current_page: 1, last_page: 1, per_page: this.itemsPerPage, total: 0 } }))
          )
        )
      ).subscribe(res => {
        this.displayedTransfers = res.items ?? [];
        this.currentPage = res.meta?.current_page ?? 1;
        this.hasMore = (res.meta?.current_page ?? 1) < (res.meta?.last_page ?? 1);
        this.loading = false;
      })
    );

    // ✅ chargement initial
    this.reload();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // appelé par (input)
  onSearchInput(value: string): void {
    this.search$.next(value);
  }

  reload(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.loading = true;

    this.sendService.getMyTransfers({
      search: this.searchQuery.trim() || undefined,
      page: 1,
      per_page: this.itemsPerPage,
      sort_by: 'created_at',
      sort_dir: 'desc'
    }).subscribe({
      next: (res) => {
        this.displayedTransfers = res.items ?? [];
        this.currentPage = res.meta?.current_page ?? 1;
        this.hasMore = (res.meta?.current_page ?? 1) < (res.meta?.last_page ?? 1);
        this.loading = false;
      },
      error: () => {
        this.displayedTransfers = [];
        this.hasMore = false;
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.loading = true;

    const nextPage = this.currentPage + 1;
    this.sendService.getMyTransfers({
      search: this.searchQuery.trim() || undefined,
      page: nextPage,
      per_page: this.itemsPerPage,
      sort_by: 'created_at',
      sort_dir: 'desc'
    }).subscribe({
      next: (res) => {
        this.displayedTransfers = this.displayedTransfers.concat(res.items ?? []);
        this.currentPage = res.meta?.current_page ?? nextPage;
        this.hasMore = (res.meta?.current_page ?? nextPage) < (res.meta?.last_page ?? nextPage);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.hasMore = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
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
    return (value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  formatAmount(amount?: number): string {
    const n = Number(amount ?? 0);
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      .format(Number.isFinite(n) ? n : 0);
  }

  formatDate(date?: Date): string {
    const d = date instanceof Date ? date : new Date(date ?? Date.now());
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }
}
