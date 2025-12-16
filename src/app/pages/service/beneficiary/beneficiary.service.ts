import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Beneficiary } from '@/core/models/beneficiary.model';
import { environment } from 'src/environements/environment.dev';
 
type ApiResponse<T> = { success: boolean; message: string; data: T };

type PaginatedData<T> = {
  items: T[];
  meta: { total: number; per_page: number; current_page: number; last_page: number };
};

@Injectable({ providedIn: 'root' })
export class BeneficiaryService {
  // ✅ correspond au prefix Laravel: /beneficiaires/...
private readonly baseUrl = `${environment.apiUrl}/beneficiaires`;

  constructor(private http: HttpClient) {}

  /** GET /beneficiaires/all?search=&per_page= */
  getAll(params?: { search?: string; per_page?: number }): Observable<PaginatedData<Beneficiary>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));

    return this.http
      .get<ApiResponse<PaginatedData<Beneficiary>>>(`${this.baseUrl}/all`, { params: httpParams })
      .pipe(
        map((res) => ({
          items: (res.data.items ?? []).map((b) => new Beneficiary(b)), // ✅ classe utilisée
          meta: res.data.meta,
        }))
      );
  }

  /** GET /beneficiaires/getById/{id} */
  getById(id: number): Observable<Beneficiary> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/getById/${id}`)
      .pipe(map((res) => new Beneficiary(res.data)));
  }

  /** POST /beneficiaires/create */
  create(payload: { nom: string; prenom: string; phone: string }): Observable<Beneficiary> {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/create`, payload)
      .pipe(map((res) => new Beneficiary(res.data)));
  }
 
  /** PUT /beneficiaires/updateById/{id} */
  updateById(id: number, payload: { nom?: string; prenom?: string; phone?: string }): Observable<Beneficiary> {
    return this.http
      .put<ApiResponse<any>>(`${this.baseUrl}/updateById/${id}`, payload)
      .pipe(map((res) => new Beneficiary(res.data)));
  }

  /** DELETE /beneficiaires/deleteById/{id} */
  deleteById(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/deleteById/${id}`)
      .pipe(map(() => void 0));
  }
}
