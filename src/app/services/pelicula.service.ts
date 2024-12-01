import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiUrl = 'https://www.omdbapi.com/';
  private apiClave = '295b2105'; 

  constructor(private http: HttpClient) {}
  // obtiene las películas por año porque la api solo te permite realizar consultas por algun filtro
  getPeliculasAn(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?s=movie&y=${year}&apikey=${this.apiClave}`);
  }
  // para mandar las pelicular de 2010 a 2020
  getPeliculas(): Observable<any[]> {
    const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
    const requests = years.map(year => this.getPeliculasAn(year));
    //permite mandar al mismo tiempo todas las peliculas de todos loa años del 2010-2020
    return forkJoin(requests); 
  }
}


