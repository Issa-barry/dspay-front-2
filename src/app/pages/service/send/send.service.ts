import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environements/environment.dev';
import { SendModel } from 'src/app/core/models/send.model';

type ApiResponse<T> = { success: boolean; message: string; data: T };

type PaginatedData<T> = {
  items: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

@Injectable({ providedIn: 'root' })
export class SendService {
  private readonly baseUrl = `${environment.apiUrl}/transferts`;

  constructor(private http: HttpClient) {}

  /** GET /transferts/by-user?search=&page=&per_page= */
  getMyTransfers(params?: {
    search?: string;
    page?: number;
    per_page?: number;
    statut?: string | string[];
    beneficiaire_id?: number;
    date_from?: string; // YYYY-MM-DD
    date_to?: string;   // YYYY-MM-DD
    sort_by?: 'created_at' | 'montant_euro' | 'total' | 'code';
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

    // statut peut être string ou array
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

  /** (optionnel) GET /transferts/{id} */
  getById(id: number): Observable<SendModel> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => new SendModel(res.data)));
  }
}
