import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-show-files',
  templateUrl: './show-files.component.html',
  styleUrls: ['./show-files.component.scss']
})
export class ShowFilesComponent implements OnInit {
  Files: string[] = [];
  entity: any = {};
  filePropertyName: string = '';
  servicefunction: any;
  private subscription: Subscription = new Subscription();


  constructor(
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    if (this.config.data != null) {
      this.entity = this.config.data.entity;
      this.filePropertyName = this.config.data.filePropertyName || 'files';
      this.Files = this.entity[this.filePropertyName] || [];
      this.servicefunction = this.config.data.servicefunction
    }
  }

  extractFileName(url: string): string {
    const lastSlashIndex = url.lastIndexOf('_');
    return url.substring(lastSlashIndex + 1);
  }

  getIconByExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'xls':
      case 'csv':
      case 'xlsb':
      case 'xlsx':
        return 'pi pi-file-excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi pi-image';
      default:
        return 'pi pi-file';
    }
  }

  delete(file: string) { 
    this.subscription.add(
      this.servicefunction(this.entity).pipe(
        finalize(() => {})
      ).subscribe((res) => {
        if (res.body) {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `You have deleted the file: ${this.extractFileName(file)}`,
            life: 3000
          });
        }
      }, (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: `Error when deleting the file: ${this.extractFileName(file)}`,
          life: 3000
        });
      })
    );
  }
  

  deleteFile(file: string) { 
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this file?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const fileIndex = this.Files.indexOf(file);
        if (fileIndex !== -1) {
          this.Files.splice(fileIndex, 1);
        }

        this.entity.files = this.Files;
        this.delete(file); 
      },
    });
  }
}
