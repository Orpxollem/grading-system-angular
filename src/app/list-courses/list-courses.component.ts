import { Component, Input, OnInit } from '@angular/core';
import { CoursesService } from '../Services/courses.service';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-list-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-courses.component.html',
  styleUrl: './list-courses.component.scss'
})
export class ListCoursesComponent implements OnInit {
  @Input() filterSemester: string = 'All';
  @Input() gpaBySemester: { [semester: string]: number } = {};

  coursesBySemester: { [semester: string]: { name: string, grade: string, credits: number }[] } = {};

  constructor(private courseService: CoursesService, private toast: NgToastService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses) => {
      this.groupCoursesBySemester(courses);
    });
  }

  groupCoursesBySemester(courses: any[]) {
    this.coursesBySemester = {};
    for (const course of courses) {
      if (!this.coursesBySemester[course.semester]) {
        this.coursesBySemester[course.semester] = [];
      }
      this.coursesBySemester[course.semester].push(course);
    }
  }

  deleteCourse(index: number) {
    this.courseService.deleteCourse(index);
    this.toast.warning('Warning', 'Course Deleted', 3000);
  }
}
