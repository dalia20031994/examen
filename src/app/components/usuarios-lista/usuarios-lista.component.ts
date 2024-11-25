import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';  
import { PaginacionComponent } from '../../paginacion/paginacion.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './usuarios-lista.component.html',
  imports: [CommonModule, PaginacionComponent],
  styleUrls: ['./usuarios-lista.component.css'],
  standalone: true
})
export class UsuariosListaComponent implements OnInit {
  users: any[] = []; 
  paginatedUsers: any[] = []; 
  itemsPerPage: number = 10; 
  currentPage: number = 1;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    // obtiene los usuarios
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.updatePaginatedUsers(); 
        console.error('Respuesta inesperada:', this.users);

      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; 
    this.itemsPerPage = event.pageSize; 
    this.updatePaginatedUsers(); 
  }
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }
}
