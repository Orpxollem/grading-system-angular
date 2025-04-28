import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courses: { name: string; grade: string; credits: number; semester: string }[] = [];
  private coursesList = new BehaviorSubject(this.courses);
  private gpaBySemester = new BehaviorSubject<{ [semester: string]: number }>({});
  private cgpa = new BehaviorSubject<number>(0);

  getCourses() {
    return this.coursesList.asObservable();
  }

  getGPABySemester() {
    return this.gpaBySemester.asObservable();
  }

  getCGPA() {
    return this.cgpa.asObservable();
  }

  addCourse(course: { name: string; grade: string; credits: number; semester: string }) {
    this.courses.push(course);
    this.coursesList.next(this.courses);
    this.updateGpas();
  }

  deleteCourse(index: number) {
    this.courses.splice(index, 1);
    this.coursesList.next(this.courses);
    this.updateGpas();
  }

  getGradeLetter(grade: number): string {
    if (grade >= 80) return 'A';
    if (grade >= 75) return 'B+';
    if (grade >= 70) return 'B';
    if (grade >= 65) return 'C+';
    if (grade >= 60) return 'C';
    if (grade >= 55) return 'D+';
    if (grade >= 50) return 'D';
    return 'F';
  }

  getGradePoint(letter: string): number {
    switch (letter) {
      case 'A': return 4.0;
      case 'B+': return 3.5;
      case 'B': return 3.0;
      case 'C+': return 2.5;
      case 'C': return 2.0;
      case 'D+': return 1.5;
      case 'D': return 1.0;
      default: return 0.0;
    }
  }

  private updateGpas() {
    const semesterMap: { [key: string]: { totalPoints: number; totalCredits: number } } = {};
    let totalPoints = 0, totalCredits = 0;

    for (const course of this.courses) {
      const gp = this.getGradePoint(course.grade);
      const sem = course.semester;

      if (!semesterMap[sem]) semesterMap[sem] = { totalPoints: 0, totalCredits: 0 };

      semesterMap[sem].totalPoints += gp * course.credits;
      semesterMap[sem].totalCredits += course.credits;

      totalPoints += gp * course.credits;
      totalCredits += course.credits;
    }

    const gpaResults: { [semester: string]: number } = {};
    for (const sem in semesterMap) {
      const { totalPoints, totalCredits } = semesterMap[sem];
      gpaResults[sem] = parseFloat((totalPoints / totalCredits).toFixed(2));
    }

    this.gpaBySemester.next(gpaResults);
    const newCgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    this.cgpa.next(parseFloat(newCgpa.toFixed(2)));
  }
}
