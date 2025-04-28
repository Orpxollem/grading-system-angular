import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../Services/courses.service';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss'
})
export class AddCourseComponent {
  @Input() availableSemesters: string[] = []; // ✅ Add this
  courseName: string = '';
  grade: number = 0;
  credits: number = 1;
  semester: string = '';

  constructor(private courseService: CoursesService, private toast: NgToastService) {}

  resetFields() {
    this.courseName = '';
    this.grade = 0;
    this.credits = 1;
    this.semester = '';
  }

  addCourse() {
    if (!this.semester.trim()) {
      this.toast.danger('Error', 'Semester is required', 3000);
      return;
    }

    if (!this.courseName.trim()) {
      this.toast.danger('Error', 'Course name is required', 3000);
      return;
    }

    if (this.grade < 0 || this.grade > 100) {
      this.toast.danger('Error', 'Grade must be between 0 and 100', 3000);
      return;
    }

    if (this.credits < 1) {
      this.toast.danger('Error', 'Credits must be >= 1', 3000);
      return;
    }

    this.courseService.addCourse({
      name: this.courseName,
      grade: this.courseService.getGradeLetter(this.grade),
      credits: this.credits,
      semester: this.semester
    });

    this.toast.success('Success', 'Course added', 3000);
    this.resetFields();
  }
}
