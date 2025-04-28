import { Component, OnInit } from '@angular/core';
import { AddCourseComponent } from "./add-course/add-course.component";
import { ListCoursesComponent } from "./list-courses/list-courses.component";
import { CoursesService } from './Services/courses.service';
import { CommonModule } from '@angular/common';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-angular-popup';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddCourseComponent, ListCoursesComponent, CommonModule, NgToastModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ToasterPosition = ToasterPosition;
  title = 'grading-system';

  cgpa: number = 0;
  gpaBySemester: { [semester: string]: number } = {};
  availableSemesters: string[] = [];
  selectedSemester: string = 'All';

  constructor(private course: CoursesService) {}

  ngOnInit() {
    this.course.getCGPA().subscribe((cgpa) => {
      this.cgpa = cgpa;
    });

    this.course.getGPABySemester().subscribe((gpaMap) => {
      this.gpaBySemester = gpaMap;
      this.updateSemesterOptions(Object.keys(gpaMap));
    });
  }

  updateSemesterOptions(semesters: string[]) {
    const semesterNumbers = semesters
      .map(s => parseInt(s.replace(/[^0-9]/g, '')))
      .filter(n => !isNaN(n));

    const maxSem = Math.max(...semesterNumbers, 0);
    this.availableSemesters = [];

    for (let i = 1; i <= maxSem + 1; i++) {
      this.availableSemesters.push(`Semester ${i}`);
    }
  }

  getGpaColor(): string {
    if (this.cgpa >= 3.5) return 'bg-success';
    if (this.cgpa >= 2.5) return 'bg-warning';
    return 'bg-danger';
  }
}
