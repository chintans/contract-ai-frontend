import { Component, Output, EventEmitter, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxFileDropModule, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-contract-upload',
  standalone: true,
  imports: [
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

  @Output() uploadDataChange = new EventEmitter<{ contractType: string; selectedFile: File | null; contractId?: string; status?: string; error?: string }>();

  private readonly contractAnalysisService = inject(ContractAnalysisService);

  constructor() {}

  dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.selectedFile = file;
          this.tryUpload();
        });
      }
    }
  }

  fileOver(event: boolean): void {
    this.isDragging = event;
  }

  fileLeave(): void {
    this.isDragging = false;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.emitUploadData();
  }

  onContractTypeChange(): void {
    this.tryUpload();
  }

  private tryUpload(): void {
    this.emitUploadData(); // always emit current state
    if (this.contractType && this.selectedFile) {
      this.startUpload();
    }
  }

  private async startUpload(): Promise<void> {
    this.isUploading = true;
    this.emitUploadData();
    try {
      await this.contractAnalysisService.uploadContract(this.selectedFile!, this.contractType);
      const analysis = await firstValueFrom(this.contractAnalysisService.getCurrentAnalysis());
      this.isUploading = false;
      this.emitUploadData(analysis?.contractId, analysis?.status);
    } catch (err: any) {
      this.isUploading = false;
      this.emitUploadData(undefined, 'error', err?.message || 'Upload failed');
    }
  }

  emitUploadData(contractId?: string, status?: string, error?: string): void {
    this.uploadDataChange.emit({
      contractType: this.contractType,
      selectedFile: this.selectedFile,
      contractId,
      status,
      error
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 