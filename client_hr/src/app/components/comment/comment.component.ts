import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { Report } from 'src/app/interface/report';
import { Comment } from 'src/app/interface/comment';
import { FlashMessageService } from 'src/app/services/flash-message.service';

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

  description: string = "";

  constructor(
    private route: ActivatedRoute, 
    private reportService: ReportService,
    private flashMessageService: FlashMessageService
  ) { }

  ngOnInit(): void {

    this.loadReport();

  }

  toggleReport(reportId: string){
    this.reportService.toggleReportStatus(reportId).subscribe(next => {
      this.flashMessageService.info(`Report is now ${next.status}!`);
      this.loadReport();
    })
  }

  addComment(){
    if(this.report){
      this.reportService.addComment(this.report._id, this.description).subscribe(next => {
        this.flashMessageService.info('Comment is successfully submitted!')
        this.loadReport();
      })
    }
  }

  loadReport(){
    this.reportService.getComments(this.reportId).subscribe(next =>{
      this.report = next.report;
      this.comments = next.comments;
      console.log(this.comments);
    })
  }

}
