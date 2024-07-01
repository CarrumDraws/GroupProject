import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { PageEvent } from '@angular/material/paginator';
import { Report } from 'src/app/interface/report';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { Comment } from 'src/app/interface/comment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})


export class ReportComponent implements OnInit {
  @Input() houseId: string = '';

  reports: Report[] = [];
  paginatedReports: Report[] = [];
  totalReports = 0;
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions = [3, 4, 5];

  comments: Comment[] = [];
  toggleComments: boolean = false;

  constructor(
    private reportService: ReportService,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports(this.houseId).subscribe(data => {
      this.reports = data;

      // Sort reports by timestamp in descending order
      this.reports.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      this.totalReports = data.length;
      this.paginateReports();
    });
  }

  paginateReports(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedReports = this.reports.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.paginateReports();
  }

  toggleReport(reportId: string){
    this.reportService.toggleReportStatus(reportId).subscribe(next => {
      this.flashMessageService.info(`Report is now ${next.status}!`);
      this.loadReports();
    })
  }

  viewComment(report: Report){
    console.log(report._id)
    window.open(`${environment.myUrl}/comment/${report._id}`, '_blank');
  }
}