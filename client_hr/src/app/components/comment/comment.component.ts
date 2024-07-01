import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { Report } from 'src/app/interface/report';
import { Comment } from 'src/app/interface/comment';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  reportId: string = this.route.snapshot.params['reportId'];
  report: Report | null = null;
  comments: Comment[] | null = null;
  status: boolean | null = null;
  employeeId = "";

  description: string = "";
  editCommentId: string | null = "";

  constructor(
    private route: ActivatedRoute, 
    private reportService: ReportService,
    private flashMessageService: FlashMessageService,
    private employeeService: EmployeeService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {

    this.loadReport();

    this.employeeService.getPersonalInfo().subscribe( next => {
      if(next){
        this.employeeId = next.profile.employee_id._id;
        console.log(this.employeeId);
      }
    })
  }

  toggleReport(reportId: string){
    this.reportService.toggleReportStatus(reportId).subscribe(next => {
      this.flashMessageService.info(`Report is now ${next.status}!`);
      this.loadReport();
    })
  }

  addComment(){
    if(this.report?.status == 'Closed'){
      this.flashMessageService.warn('Report is closed, comment cannot be updated');
      return;
    }

    //add comment
    if(!this.editCommentId){
      if(this.report){
        this.reportService.addComment(this.report._id, this.description).subscribe(next => {
          this.flashMessageService.info('Comment is successfully submitted!')
          this.loadReport();
        })
      }
    }//edit comment
    else{
      this.reportService.editComment(this.editCommentId, this.description).subscribe(next => {
        this.flashMessageService.info('Comment is successfully edited!')
        this.loadReport();
        }
      )
    }
  }

  loadReport(){
    this.reportService.getComments(this.reportId).subscribe(next =>{
      this.report = next.report;
      this.comments = next.comments;
      this.description = "";
      this.editCommentId = null;
    })
  }
  
  onEdit(comment: Comment){
    this.viewportScroller.scrollToPosition([0, document.body.scrollHeight]);

    this.editCommentId = comment._id;
    this.description = comment.description;
  }

  editComment(comment: Comment){
    this.reportService.addComment(comment._id, this.description).subscribe(next => {
      this.flashMessageService.info('Comment is successfully edited!')
      this.loadReport();
      } 
    )
  }

  cancelEdit(){
    this.editCommentId = null;
    this.description = "";
  
  }
  

}
