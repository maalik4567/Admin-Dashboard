import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { Students } from 'src/app/models/student';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { StdService } from 'src/app/std.service';
import { Inject,inject } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [FormsModule,NgFor,NgIf,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, FormControlDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective]
})
export class LayoutComponent implements OnInit {

  student: Students = {
    Id: 0,
    Name: '',
    Courses: '',
    Class: '',
    ContactNumber: '',
    MarkedCourseIds:'',
    ClassId:''
  };

  selectedCourses: string[] = [];
  availableCourses: { Value: string, Text: string }[] = [];
  availableClasses: { Value: string, Text: string }[] = [];
 
  constructor(private studentService: StdService) { }


  ngOnInit(): void {
    this.loadClasses();
    this.loadCourses();
  }

  loadClasses():void{
    this.studentService.getClasses().subscribe((data)=>{
      this.availableClasses = data.map(classVal=>({Value : classVal.Value,Text:classVal.Text}))
    })
  }
  loadCourses(){
    this.studentService.getCourses().subscribe((data)=>{
      this.availableCourses = data.map(course=>({Value:course.Value,Text:course.Text}));
    })
  }

    // Validation state properties
    nameValid: boolean = true;
    contactValid: boolean = true;
    classValid: boolean = true;
    coursesValid: boolean = true;

    addCourse(courseValue: string): void {
      if (courseValue && !this.selectedCourses.includes(courseValue)) {
        this.selectedCourses.push(courseValue);
      }
    }
    
    removeCourse(courseValue: string): void {
      this.selectedCourses = this.selectedCourses.filter(value => value !== courseValue);
    }

  

    
  onSubmit(): void {

    // Reset validation flags
    this.nameValid = !!this.student.Name;
    this.contactValid = !!this.student.ContactNumber;
    this.classValid = !!this.student.Class;
    this.coursesValid = this.selectedCourses.length > 0;

   if (!this.student.Name || !this.student.ContactNumber || !this.student.Class || this.selectedCourses.length === 0) {
     // Display validation error or handle it accordingly
     return;
   }
   
   const studentData = {
    student: {
      Name: this.student.Name,
      ContactNumber: this.student.ContactNumber,
      Class: this.student.Class,
    },
     MarkedCourses: this.selectedCourses.map(course => {
    const foundCourse = this.availableCourses.find(c => c.Text === course);
    return foundCourse ? foundCourse.Value : null;
  }).filter(value => value !== null)
  };

  console.log(this.selectedCourses);
  console.log(studentData);
  this.studentService.createStd(studentData).subscribe(() => {
    this.resetForm();
  });

  

  }

  resetForm(): void {
    this.student = {
      Id: 0,
      Name: '',
      Courses: '',
      Class: '',
      ContactNumber: '',
      MarkedCourseIds:'',
      ClassId:''
    };
    this.selectedCourses = [];
  }

}
