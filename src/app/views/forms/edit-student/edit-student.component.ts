import { Component, OnInit } from '@angular/core';
import { Students } from 'src/app/models/student';
import { ActivatedRoute } from '@angular/router';
import { StdService } from 'src/app/std.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { Inject,inject } from '@angular/core';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, NgIf,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, FormControlDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.scss'
})
export class EditStudentComponent implements OnInit {

  student: Students = {
    Id: 0,
    Name: '',
    Courses: '',
    Class: '',
    ContactNumber: '',
    MarkedCourseIds: '',
    ClassId:''
  };

  selectedCourses: { Value: string, Text: string }[] = [];
  availableCourses: { Value: string, Text: string }[] = [];
  availableClasses: { Value: string, Text: string }[] = [];

  nameValid: boolean = true;
  contactValid: boolean = true;
  classValid: boolean = true;
  coursesValid: boolean = true;

  studentService = inject(StdService);
  route = inject(ActivatedRoute);

  constructor(private router: Router) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentService.getStudentById(parseInt(id)).subscribe((student) => {
        this.student = student;

        this.loadClasses(() => {
          this.student.ClassId = student.ClassId;  // Load class once classes are available
        });

        this.loadCourses(() => {
          const markedCourseIds = student.MarkedCourseIds.split(',').map(courseId => courseId.trim());
          this.selectedCourses = this.availableCourses.filter(course => markedCourseIds.includes(course.Value));
        });
      });
    } else {
      this.loadClasses();
      this.loadCourses();
    }
  }

  loadCourses(callback?: () => void): void {
    this.studentService.getCourses().subscribe((data) => {
      this.availableCourses = data.map(course => ({ Value: course.Value, Text: course.Text }));
      if (callback) callback();
    });
  }

  loadClasses(callback?: () => void): void {
    this.studentService.getClasses().subscribe((data) => {
      this.availableClasses = data.map(classVal => ({ Value: classVal.Value, Text: classVal.Text }));
      if (callback) callback();
    });
  }

  addCourse(courseValue: string): void {
    const course = this.availableCourses.find(c => c.Value === courseValue);
    if (course && !this.selectedCourses.some(c => c.Value === course.Value)) {
      this.selectedCourses.push(course);
    }
  }

  removeCourse(courseValue: string): void {
    this.selectedCourses = this.selectedCourses.filter(c => c.Value !== courseValue);
  }

  onSubmit(): void {
    this.nameValid = !!this.student.Name;
    this.contactValid = !!this.student.ContactNumber;
    this.classValid = !!this.student.Class;
    this.coursesValid = this.selectedCourses.length > 0;

    if (!this.nameValid || !this.contactValid || !this.classValid || !this.coursesValid) {
      return;
    }

    const studentData = {
      Id: this.student.Id,
      student: {
        Id: this.student.Id,
        Name: this.student.Name,
        ContactNumber: this.student.ContactNumber,
        ClassId: this.student.ClassId,
      },
      MarkedCourses: this.selectedCourses.map(course => course.Value)
    };

    this.studentService.updateStudent(studentData.Id, studentData).subscribe(() => {
      this.resetForm();
      this.router.navigate(['/base/tables']);
    });
  }

  resetForm(): void {
    this.student = {
      Id: 0,
      Name: '',
      Courses: '',
      ClassId: '',
      ContactNumber: '',
      MarkedCourseIds: '',
      Class:'',
    };
    this.selectedCourses = [];
  }



}
