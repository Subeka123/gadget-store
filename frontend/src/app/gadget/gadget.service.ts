import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Gadget {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class GadgetService {

  private apiUrl = 'http://localhost:3000/api/gadgets';
  constructor(private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Add the Authorization header
    });
  }
  
  getAllGadgets(): Observable<Gadget[]> {
    return this.http.get<Gadget[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createGadget(gadget: Gadget): Observable<Gadget> {
    return this.http.post<Gadget>(this.apiUrl, gadget, { headers: this.getHeaders() });
  }

  updateGadget(id: number, gadget: Gadget): Observable<Gadget> {
    return this.http.put<Gadget>(`${this.apiUrl}/${id}`, gadget, { headers: this.getHeaders() });
  }

  deleteGadget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getGadgetById(id: number): Observable<Gadget> {
    return this.http.get<Gadget>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  bulkDeleteGadgets(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-delete`, { ids }, { headers: this.getHeaders() });
  }
  
  bulkUpdateGadgets(gadgets: any[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bulk-update`, gadgets, { headers: this.getHeaders() });
  }
}
