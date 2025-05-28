import { Injectable } from '@angular/core';
import { z } from 'zod';

// Define Zod schemas for each step
const uploadSchema = z.object({
  contractType: z.string().min(1, 'Contract type is required'),
  selectedFile: z.instanceof(File, { message: 'A contract file must be selected' })
});

const analysisSchema = z.object({
  analysis: z.any() // Replace with actual analysis structure if available
});

const riskFlagsSchema = z.object({
  risks: z.array(z.any()) // Replace with actual risk structure if available
});

const summarySchema = z.object({
  summary: z.any() // Replace with actual summary structure if available
});

const qaSchema = z.object({
  questions: z.array(z.string())
});

@Injectable({
  providedIn: 'root'
})
export class StepValidationService {
  validateUpload(data: unknown): boolean {
    const result = uploadSchema.safeParse(data);
    return result.success;
  }

  validateAnalysis(data: unknown): boolean {
    const result = analysisSchema.safeParse(data);
    return result.success;
  }

  validateRiskFlags(data: unknown): boolean {
    const result = riskFlagsSchema.safeParse(data);
    return result.success;
  }

  validateSummary(data: unknown): boolean {
    const result = summarySchema.safeParse(data);
    return result.success;
  }

  validateQA(data: unknown): boolean {
    const result = qaSchema.safeParse(data);
    return result.success;
  }
} 