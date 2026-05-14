import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../../services/task.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const taskServiceMock = {
    getTasks: () => of([]),
    createTask: () => of({}),
    updateTask: () => of({}),
    deleteTask: () => of({ message: 'Tarea eliminada' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: TaskService,
          useValue: taskServiceMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});