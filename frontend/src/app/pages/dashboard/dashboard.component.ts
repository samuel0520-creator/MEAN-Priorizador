import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TaskService, Task } from '../../services/task.service';

interface AppUser {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  titulo = '';
  descripcion = '';
  urgencia = 1;
  importancia = 1;

  busqueda = '';
  filtroClasificacion = 'Todas';
  filtroEstado = 'Todos';

  tareas: Task[] = [];
  usuarioActual: AppUser | null = null;

  editando = false;
  tareaEditandoId: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const userStorage = localStorage.getItem('user');

    if (!userStorage) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioActual = JSON.parse(userStorage);

    this.cargarTareas();
  }

  cargarTareas(): void {

    if (!this.usuarioActual) return;

    this.taskService
      .getTasksByUser(this.usuarioActual._id)
      .subscribe({

        next: (tasks: Task[]) => {
          this.tareas = tasks;
        },

        error: (error: any) => {
          console.error('Error cargando tareas:', error);
        }

      });
  }

  agregarTarea(): void {

    if (this.titulo.trim() === '') return;
    if (!this.usuarioActual) return;

    const tarea: Task = {
      user: this.usuarioActual._id,
      title: this.titulo,
      description: this.descripcion,
      urgency: this.urgencia,
      importance: this.importancia,
      status: 'Pendiente'
    };

    if (this.editando && this.tareaEditandoId) {

      this.taskService
        .updateTask(this.tareaEditandoId, tarea)
        .subscribe({

          next: () => {
            this.cargarTareas();
            this.limpiarFormulario();
          },

          error: (error: any) => {
            console.error('Error actualizando tarea:', error);
          }

        });

    } else {

      this.taskService
        .createTask(tarea)
        .subscribe({

          next: () => {
            this.cargarTareas();
            this.limpiarFormulario();
          },

          error: (error: any) => {
            console.error('Error creando tarea:', error);
          }

        });
    }
  }

  editarTarea(index: number): void {

    const tarea = this.tareasFiltradas()[index];

    this.titulo = tarea.title;
    this.descripcion = tarea.description || '';
    this.urgencia = tarea.urgency;
    this.importancia = tarea.importance;

    this.editando = true;
    this.tareaEditandoId = tarea._id || null;
  }

  eliminarTarea(index: number): void {

    const tarea = this.tareasFiltradas()[index];

    if (!tarea._id) return;

    const confirmar = confirm(
      `¿Eliminar la tarea "${tarea.title}"?`
    );

    if (!confirmar) return;

    this.taskService
      .deleteTask(tarea._id)
      .subscribe({

        next: () => {
          this.cargarTareas();
        },

        error: (error: any) => {
          console.error('Error eliminando tarea:', error);
        }

      });
  }

  cambiarEstado(
    tarea: Task,
    nuevoEstado: 'Pendiente' | 'En progreso' | 'Completada'
  ): void {

    if (!tarea._id) return;

    this.taskService
      .updateTask(tarea._id, {
        status: nuevoEstado
      })
      .subscribe({

        next: () => {
          this.cargarTareas();
        },

        error: (error: any) => {
          console.error('Error cambiando estado:', error);
        }

      });
  }

  tareasFiltradas(): Task[] {

    return this.tareas.filter((tarea: Task) => {

      const coincideBusqueda =
        tarea.title
          .toLowerCase()
          .includes(this.busqueda.toLowerCase())

        ||

        (tarea.description || '')
          .toLowerCase()
          .includes(this.busqueda.toLowerCase());

      const coincideClasificacion =
        this.filtroClasificacion === 'Todas'
        ||
        tarea.classification === this.filtroClasificacion;

      const coincideEstado =
        this.filtroEstado === 'Todos'
        ||
        tarea.status === this.filtroEstado;

      return (
        coincideBusqueda
        &&
        coincideClasificacion
        &&
        coincideEstado
      );

    });
  }

  cerrarSesion(): void {

    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }

  limpiarFormulario(): void {

    this.titulo = '';
    this.descripcion = '';
    this.urgencia = 1;
    this.importancia = 1;

    this.editando = false;
    this.tareaEditandoId = null;
  }

  obtenerClase(clasificacion?: string): string {

    if (clasificacion === 'Alta') return 'alta';

    if (clasificacion === 'Media') return 'media';

    return 'baja';
  }

  totalAltas(): number {
    return this.tareas.filter(
      (t: Task) => t.classification === 'Alta'
    ).length;
  }

  totalMedias(): number {
    return this.tareas.filter(
      (t: Task) => t.classification === 'Media'
    ).length;
  }

  totalBajas(): number {
    return this.tareas.filter(
      (t: Task) => t.classification === 'Baja'
    ).length;
  }
}