import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/interface/profile';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { File } from 'src/app/interface/file';
import { FileService } from 'src/app/services/file.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile$: Observable<Profile | null> = new Observable<Profile | null>();
  picture$: Observable<string | null> = new Observable<string | null>();

  //FIles are dummpy data still
  files: File[] | null = null;

  constructor(
    private route: ActivatedRoute, 
    private profileService: ProfileService,
    private fileService: FileService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // const employeeId = "667a350722a96c9de64d682c";
    const employeeId: string = this.route.snapshot.params['employeeId'];

    //get profile and profile picture
    this.profile$ = this.profileService.getProfile(employeeId);

    // this.picture$.subscribe(profile => {
    //   console.log(this.profile$.)
    // });

    // this.files = this.fileService.getFilesByEmployeeId(employeeId);
  }

  // showFile(url: string){
  //   this.fileService.newTapForFile(url);
  // }

<<<<<<< HEAD
  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl }
    });
=======
      //get opt recipet
      if (opt.optreciept) {
        fileObservables.push(this.fileService.getFileUrl(opt.optreciept));
      }
      //get opt ead
      if (opt.optead) {
        fileObservables.push(this.fileService.getFileUrl(opt.optead));
      }
      //get I-983
      if (opt.i983) {
        opt.i983.forEach(file_id => {
          fileObservables.push(this.fileService.getFileUrl(file_id));
        });
      }
      //get I-20
      if (opt.i20) {
        fileObservables.push(this.fileService.getFileUrl(opt.i20));
      }

      //get license
      if(profile.profile.license.haslicense){
        fileObservables.push(this.fileService.getFileUrl(profile.profile.license.licensefile).pipe(
          map((file: File) => {
            let license = file;
            license.fileType = "license";
            return license;
          })
        ));
      }
    
      //async operation to make sure we get the fils before udpating action for each visa
      forkJoin(fileObservables).subscribe(files => {
        this.fileList = files.filter(file => file.status == 'Approved' || file.fileType == "license");
      });
  }


  openPdf(file: File): void {
    this.pdfViewer.open(file);
>>>>>>> 17fdb79 (updated page)
  }

}