import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Pelicula {
  Title: string;
  Year: string;
  // Agrega más campos según la estructura de la respuesta de la API
}

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiUrl = 'https://www.omdbapi.com/';
  private apiClave = '295b2105'; 

  constructor(private http: HttpClient) {}

  private construirUrl(year: number): string {
    return `${this.apiUrl}?s=movie&y=${year}&apikey=${this.apiClave}`;
  }

  // Obtiene las películas por año
  getPeliculasAn(year: number): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.construirUrl(year)).pipe(
      catchError(this.manejarError)
    );
  }

  // Para mandar las películas de 2010 a 2020
  getPeliculas(): Observable<Pelicula[]> {
    const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
    const requests = years.map(year => this.getPeliculasAn(year));
    
    // Permite mandar al mismo tiempo todas las películas de todos los años del 2010-2020
    return forkJoin(requests).pipe(
      map(responses => responses.flat()), // Aplana el array de arrays
      catchError(this.manejarError)
    );
  }

  private manejarError(error: HttpErrorResponse) {
    // Manejo de errores
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
