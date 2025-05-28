// Reminder: Run 'pnpm add socket.io-client' if not already installed.
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QnAService {
  private socket: Socket;

  constructor() {
    this.socket = io(`${environment.apiUrl}/contract-chat`, {
      transports: ['websocket'],
    });
  }

  askQuestion(contractId: string, question: string): Observable<{ answer: string; confidence: number }> {
    return new Observable(observer => {
      this.socket.emit('askQuestion', { contractId, question });
      this.socket.once('qnaAnswer', (data: { answer: string; confidence: number }) => {
        observer.next(data);
        observer.complete();
      });
      this.socket.once('error', (err: any) => {
        observer.error(err);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
} 