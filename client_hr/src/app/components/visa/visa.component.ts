import { Component, OnInit, ViewChild } from '@angular/core';
import { Visa } from 'src/app/interface/visa';
import { VisaService } from 'src/app/services/visa.service';
import { Opt } from 'src/app/interface/opt';
import { FileService } from 'src/app/services/file.service';
import { File } from 'src/app/interface/file';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { Observable, forkJoin } from 'rxjs';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer!: PdfViewerComponent;

  constructor(
    private visaService: VisaService,
    private fileService: FileService,
    private dialog: MatDialog,
    private flashMessageService: FlashMessageService
  ) { }

  //logic variables
  visaList: Visa[] = [];
  visaResult: Visa[] = [];
  optList: Opt[] = [];

  currentSelectedUser: string = "";
  fileList:File[] = [];

  searchText: string = "";
  filterOut = "Approved";

  //files can be download in "All" filter mode
  download = false;

  ngOnInit(): void {

    this.getVisa();
    
  }

  //update card color and file associates with employee's visa status
  updateSelected(userId: string, visa: Visa):void{
    this.currentSelectedUser = userId;

    //If filter == All, select all approved files, otherwise we select pending/rejected files
    if(this.filterOut == 'Approved'){
      this.fileList = (visa.opt.files) ? visa.opt.files.filter((file) => file.status !== 'Approved') : [];
    }else{
      this.fileList = (visa.opt.files) ? visa.opt.files.filter((file) => file.status == 'Approved') : [];
    }
  }

  onFilterChange(filter: string): void {
    this.filterOut = (filter == 'All') ? '' : 'Approved';
    this.download = (filter == 'All') ? true : false;
    this.searchVisa();
    this.updateSelected(this.visaResult[0].employee_id._id, this.visaResult[0]);
  }

  //search result based on both filter and search bar
  searchVisa(){
    this.visaResult = this.visaList
    .filter(employee => 
      (employee.name.firstname + employee.name.lastname + employee.name.preferredname).toLowerCase().includes(this.searchText))
    .filter(element => element.opt.status !== this.filterOut)
  }

  getVisa(){
    this.visaService.getAllOpt().subscribe(
      next => {
        if(next){
          //retrieve List of Visa
          this.visaList = next.sort((a: Visa, b: Visa) => a.name.lastname.localeCompare(b.name.lastname));
          this.visaResult = next.sort((a: Visa, b: Visa) => a.name.lastname.localeCompare(b.name.lastname));
          this.currentSelectedUser = next[0].employee_id._id;
          //make sure filter is on pending on load
          this.onFilterChange(this.filterOut);

          //get files and action for each visa
          this.visaList.forEach(visa => {
            this.getFilesForVisa(visa);
          })
        }
      }
    )
  }

  updateActions(visa: Visa):void{
    let files: File[] = (visa.opt.files) ? visa.opt.files.filter(file => file.status != 'Approved') : [];
    let action = "";

    switch(files.length){
      case 0:
        action = "Waiting for New Submission"
        break;
      //for case OPT Receipt, OPT EAD, I-20
      case 1:
        if(files[0].status === 'Pending'){
          action = "Waiting for Approval"
        }else{
          action = "Waiting for Resubmission"
        }
        break;
      //for I-983
      case 2:
        if(files[0].status === "Pending" || files[1].status === "Pending"){
          action = "Waiting for Approval"
        } else {
          action = "Waiting for Resubmission"
        }
        break;
      default:
        break;
    }
    visa.action = action;
  }


  //read each visa's status, and update their file list
  getFilesForVisa(visa: Visa) {
    let fileObservables = [];
    //get opt recipet
    if (visa.opt.optreciept) {
      fileObservables.push(this.fileService.getFileUrl(visa.opt.optreciept));
    }
    //get opt ead
    if (visa.opt.optead) {
      fileObservables.push(this.fileService.getFileUrl(visa.opt.optead));
    }
    //get I-983
    if (visa.opt.i983) {
      visa.opt.i983.forEach(file_id => {
        fileObservables.push(this.fileService.getFileUrl(file_id));
      });
    }
    //get I-20
    if (visa.opt.i20) {
      fileObservables.push(this.fileService.getFileUrl(visa.opt.i20));
    }
  
    //async operation to make sure we get the fils before udpating action for each visa
    forkJoin(fileObservables).subscribe(files => {
      visa.opt.files = files;
      this.updateActions(visa);

      //after we get actions and files, we set the first visa in our list to show files on load
      if(visa.employee_id._id == this.currentSelectedUser){
        this.updateSelected(visa.employee_id._id, visa);
      }
    });
  }

  openFileDialog(file: File, download: boolean): void {

    this.dialog.open(FileDialogComponent, {
      data: { file, download }
    });
  }
  
  openPdf(file: File): void {
    this.pdfViewer.open(file);
  }

  onSendNotification(firstname: string){
    this.flashMessageService.info("Notification sent to " + firstname);
  }
} 