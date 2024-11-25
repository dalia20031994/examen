import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  private usuarioClave = 'usuarioActual';
  constructor(private http: HttpClient) {}
  // obtener los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // guardar usuario localmente
  setUsuarioUso(user: any): void {
    if (this.localStorageDisponible()) {
      localStorage.setItem(this.usuarioClave, JSON.stringify(user));
    } else {
      console.warn('localStorage no está disponible. No se pudo guardar el usuario.');
    }
  }
  // obtener usuario locas
  getUsuarioUso(): any {
    if (this.localStorageDisponible()) {
      const usuarioGuardado = localStorage.getItem(this.usuarioClave);
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }
    console.warn('localStorage no está disponible');
    return null;
  }
  //para limpiar cuando se cierra sesion
  limpiarUsuarioUso(): void {
    if (this.localStorageDisponible()) {
      localStorage.removeItem(this.usuarioClave);
    } else {
      console.warn('localStorage no está disponible');
    }
  }
  // comprobar disponibilidad
  private localStorageDisponible(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
