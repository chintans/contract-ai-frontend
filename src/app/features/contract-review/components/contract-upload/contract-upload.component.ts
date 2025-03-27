import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxFileDropModule, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ContractAnalysisService } from '../../services/contract-analysis.service';

@Component({
  selector: 'app-contract-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    NgxFileDropModule
  ],
  templateUrl: './contract-upload.component.html',
  styleUrls: ['./contract-upload.component.scss']
})
export class ContractUploadComponent {
  contractType = '';
  selectedFile: File | null = null;
  isUploading = false;
  isDragging = false;

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private router: Router
  ) {}

  dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.selectedFile = file;
        });
      }
    }
  }

  fileOver(event: boolean): void {
    this.isDragging = event;
  }

  fileLeave(event: boolean): void {
    this.isDragging = false;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async onSubmit(): Promise<void> {
    if (!this.selectedFile) return;

    this.isUploading = true;
    try {
      await this.contractAnalysisService.uploadContract(this.selectedFile);
      this.router.navigate(['contract-review', 'analysis']);
    } catch (error) {
      console.error('Error uploading contract:', error);
    } finally {
      this.isUploading = false;
    }
  }
} 