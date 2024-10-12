import { Component } from '@angular/core';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';
import {Students} from "../../../models/student";
import { StdService } from 'src/app/std.service';
import { Inject,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink,RouterLinkActive,RouterModule } from '@angular/router';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    standalone: true,
    imports: [RouterOutlet,RouterLink, RouterLinkActive,RouterModule,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective]
})
export class TablesComponent {
  studentList :  Students[] = [];

  studentService = inject(StdService);

   ngOnInit(): void {
    this.getAllStudents();
  }

   getAllStudents(){
      this.studentService.getStudentsAll().subscribe((res)=>{
         this.studentList = res;
      })
   }

   deleteStudent(id: number){
    const isConfirm = confirm( "Are you sure want to delete student this student");
    if(isConfirm){
      this.studentService.deleteStudent(id).subscribe((res)=>{
        console.log(res);
        alert("Student Deleted Successfully!!")
        this.getAllStudents();
      })
    }

   }

}
