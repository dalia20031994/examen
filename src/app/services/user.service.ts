import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  private usuario: any = null;
  private usuarioClave = 'usuarioActual'; 
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  //para guardar el usuario en uso
  setUsuarioUso(user: any): void {
    localStorage.setItem(this.usuarioClave, JSON.stringify(user)); 
  }
  //para obtener el usuario en uso
  getUsuarioUso(): any {
    const usuarioGuardado = localStorage.getItem(this.usuarioClave);
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null; 
  }
  //limpiar usuario 
  limpiarUsuarioUso(): void {
    localStorage.removeItem(this.usuarioClave);
  }
}

