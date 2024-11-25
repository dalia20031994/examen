import { TestBed } from '@angular/core/testing';

import { PeliculasService } from './pelicula.service';

describe('JuegoService', () => {
  let service: PeliculasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeliculasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
