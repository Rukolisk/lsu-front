import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carrousel } from '../../layout/carrousel/carrousel';
import { Background3d } from '../../layout/background3d/background3d';
@Component({
  selector: 'app-home',
  imports: [RouterLink, Carrousel, Background3d],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
