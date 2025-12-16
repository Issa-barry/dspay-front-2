// src/app/core/services/send.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environements/environment.dev';
import { SendModel, ServiceId } from 'src/app/core/models/send.model';

type ApiResponse<T> = { success: boolean; message: string; data: T };

export type PaginatedData<T> = {
  items: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

export type CreateTransferPayload = {
  beneficiaire_id: number;
  taux_echange_id: number;
  montant_envoie: number;
  serviceId: string;
  recipientTel?: string | null;
  accountId?: string | null;
  customerPhoneNumber?: string | null;
};


@Injectable({ providedIn: 'root' })
export class SendService {
  private readonly baseUrl = `${environment.apiUrl}/transferts`;

  constructor(private http: HttpClient) {}

  /** GET /transferts/by-user */
  getMyTransfers(params?: {
    search?: string;
    page?: number;
    per_page?: number;
    statut?: string | string[];
    beneficiaire_id?: number;
    date_from?: string;
    date_to?: string;
    sort_by?: 'created_at' | 'montant_envoie' | 'total_ttc' | 'code';
    sort_dir?: 'asc' | 'desc';
  }): Observable<PaginatedData<SendModel>> {
    let httpParams = new HttpParams();

    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));

    if (params?.beneficiaire_id) httpParams = httpParams.set('beneficiaire_id', String(params.beneficiaire_id));
    if (params?.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params?.date_to) httpParams = httpParams.set('date_to', params.date_to);

    if (params?.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params?.sort_dir) httpParams = httpParams.set('sort_dir', params.sort_dir);

    if (params?.statut) {
      if (Array.isArray(params.statut)) {
        params.statut.forEach((s) => (httpParams = httpParams.append('statut[]', s)));
      } else {
        httpParams = httpParams.set('statut', params.statut);
      }
    }

    return this.http
      .get<ApiResponse<PaginatedData<any>>>(`${this.baseUrl}/by-user`, { params: httpParams })
      .pipe(
        map((res) => ({
          items: (res.data.items ?? []).map((x: any) => new SendModel(x)),
          meta: res.data.meta,
        }))
      );
  }

  /** GET /transferts/{id} */
  getById(id: number): Observable<SendModel> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => new SendModel(res.data)));
  }

  /** POST /transferts */
  createTransfer(payload: CreateTransferPayload): Observable<SendModel> {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/envoie`, payload)
      .pipe(map((res) => new SendModel(res.data)));
  }
}
