import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PeliculasService } from '../../services/pelicula.service';
import { CommonModule } from '@angular/common';
import { PaginacionComponent } from '../../paginacion/paginacion.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-pelicula-lista',
  standalone: true,
  imports: [CommonModule, PaginacionComponent, MatDialogModule,MatButtonModule,MatIconModule,FormsModule,MatCardModule,
  MatFormFieldModule],
  templateUrl: './peliculas-lista.component.html',
  styleUrls: ['./peliculas-lista.component.css']
})
export class PeliculasListaComponent implements OnInit {
  //VARIABLES
  //para obtener las peliculas que se muestran en la tabla
  peliculas: any[] = []; 
  //peliculas para el buscador
  todasPeliculas: any[] = []; 
  //para la paginacion
  paginaPeliculas: any[] = [];  
  paginacionInicial: number = 10; 
  currentPage: number = 1; 
  //para editar
  peliculaSeleccionada: any; 
  //para editar la pelicula
  editMovie: any = {}; 
  buscador: any;
  //constructructor para guardar el usuario
  constructor(private peliculasService: PeliculasService,public dialog: MatDialog ) {}
  ngOnInit(): void {
    //obtener las peliculas
    this.peliculasService.getPeliculas().subscribe(
      (response: any[]) => {
        //como se devuelven varios areglos por lo que se unieron la busqueda de peliculas de distintos años se convinan con flatMap
        this.todasPeliculas = response.flatMap(item => item.Search); 
        this.peliculas = [...this.todasPeliculas];
        //para la paginacion
        this.modificarPaginacionPeliculas();  
      },
      (error: any) => {
        console.error('Error al obtener las películas:', error);
      }
    );
  }
  // para el cambio de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; 
    this.paginacionInicial = event.pageSize;
    this.modificarPaginacionPeliculas();  
  }
  // actualizar peliculas segun la pagina
  modificarPaginacionPeliculas(): void {
    const peliculaInicial = (this.currentPage - 1) * this.paginacionInicial;
    const peliculaFinal = this.currentPage * this.paginacionInicial;
    this.paginaPeliculas = this.peliculas.slice(peliculaInicial, peliculaFinal);
    //para el id de la pelicula
    this.paginaPeliculas = this.paginaPeliculas.map((movie, index) => ({
    ...movie,
    idPelicula: peliculaInicial + index + 1, 
  }));
  }
  //PARA EL MODAL DE LOS DETALLES
  @ViewChild('modalDetalles') ModalVerDetalles!: TemplateRef<any>;  
  abrirModal(movie: any): void {
    this.peliculaSeleccionada = movie;
    this.dialog.open(this.ModalVerDetalles);
  }
  //cerrar el modal
  cerrarModal(): void {
    this.dialog.closeAll(); 
  }
  //PARA EL MODAL DE EDITAR
  @ViewChild('modalEditar') ModalEditarDetalles!: TemplateRef<any>;
  abrirEditModal(movie: any): void {
    this.editMovie = { ...movie }; 
    this.dialog.open(this.ModalEditarDetalles);
  }
  cerrarEditModal(): void {
    this.dialog.closeAll(); 
  }
  //actualizar tabla
  guardarCambios(): void {
    const index = this.peliculas.findIndex(
      (movie) => movie.imdbID === this.editMovie.imdbID
    );
    if (index !== -1) {
      this.peliculas[index] = { ...this.editMovie };
      this.modificarPaginacionPeliculas(); 
      this.dialog.closeAll(); 
    }
  }
  //PARA ELIMINAR
  @ViewChild('modalConfirmarEliminacion') confEliminarModal!: TemplateRef<any>; 
  peliculaEliminada: any; 
  abrirEliminarModal(movie: any): void {
    this.peliculaEliminada = movie; 
    this.dialog.open(this.confEliminarModal); 
  }
  cerrarEliminarModal(): void {
    this.dialog.closeAll(); 
  }
  confirmEliminacion(): void {
    if (this.peliculaEliminada) {
      this.peliculas = this.peliculas.filter(
        (movie) => movie.imdbID !== this.peliculaEliminada.imdbID
      );
      this.modificarPaginacionPeliculas();
      this.peliculaEliminada = null;
      this.dialog.closeAll();
    }
  }
  buscar(): void {
    const term = this.buscador?.trim().toLowerCase() || ''; 
    //si no se busca nada
    if (term === '') {
      this.peliculas = [...this.todasPeliculas];
    } else {
      this.peliculas = this.todasPeliculas.filter((peli) =>
        peli.Title.toLowerCase().includes(term)
      );
    }
    this.modificarPaginacionPeliculas();
  }
}
