import { Injectable, inject } from '@angular/core';
import { VersionControlService as ApiVersionControlService } from '../../services/api/versionControl.service';
import { CreateCommitDto } from '../../services/model/createCommitDto';
import { CreateBranchDto } from '../../services/model/createBranchDto';
import { CreateRepoDto } from '../../services/model/createRepoDto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VersionControlFacade {
  private api = inject(ApiVersionControlService);

  createRepo(dto: CreateRepoDto): Observable<any> {
    return this.api.versionControlControllerCreateRepo(dto);
  }

  createBranch(id: string, dto: CreateBranchDto): Observable<any> {
    return this.api.versionControlControllerCreateBranch(id, dto);
  }

  commit(id: string, dto: CreateCommitDto): Observable<any> {
    return this.api.versionControlControllerCommit(id, dto);
  }
}
