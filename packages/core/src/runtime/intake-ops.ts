/**
 * Intake operations — 4 ops for book/PDF ingestion.
 *
 * Ops: intake_ingest_book, intake_process, intake_status, intake_preview.
 */

import { z } from 'zod';
import type { OpDefinition } from '../facades/types.js';
import type { IntakePipeline } from '../intake/intake-pipeline.js';

/**
 * Create the 4 intake operations.
 *
 * The pipeline is optional — when null, all ops return a graceful error.
 */
export function createIntakeOps(pipeline: IntakePipeline | null): OpDefinition[] {
  return [
    // ─── Ingest Book ──────────────────────────────────────────────
    {
      name: 'intake_ingest_book',
      description:
        'Ingest a PDF book — parse, hash, chunk into fixed-size page windows, and create a resumable job.',
      auth: 'write',
      schema: z.object({
        pdfPath: z.string().describe('Absolute path to the PDF file.'),
        title: z.string().describe('Book title for citation and chunk labeling.'),
        domain: z.string().describe('Knowledge domain (e.g., "design-systems", "accessibility").'),
        author: z.string().optional().describe('Book author for metadata.'),
        chunkPageSize: z.number().optional().describe('Number of pages per chunk. Defaults to 10.'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Additional tags applied to all extracted entries.'),
      }),
      handler: async (params) => {
        if (!pipeline) {
          return { error: 'Intake pipeline not configured' };
        }
        const config = {
          pdfPath: params.pdfPath as string,
          title: params.title as string,
          domain: params.domain as string,
          author: params.author as string | undefined,
          chunkPageSize: params.chunkPageSize as number | undefined,
          tags: params.tags as string[] | undefined,
        };
        return pipeline.ingestBook(config);
      },
    },

    // ─── Process Chunks ───────────────────────────────────────────
    {
      name: 'intake_process',
      description:
        'Process pending chunks for a job — extract text, classify via LLM, dedup, and store unique items in the vault.',
      auth: 'write',
      schema: z.object({
        jobId: z.string().describe('Job ID returned from intake_ingest_book.'),
        count: z
          .number()
          .optional()
          .describe('Max number of chunks to process in this batch. Defaults to 5.'),
      }),
      handler: async (params) => {
        if (!pipeline) {
          return { error: 'Intake pipeline not configured' };
        }
        return pipeline.processChunks(params.jobId as string, params.count as number | undefined);
      },
    },

    // ─── Status ───────────────────────────────────────────────────
    {
      name: 'intake_status',
      description:
        'Get intake job status. With jobId: returns job record and chunks. Without: lists all jobs.',
      auth: 'read',
      schema: z.object({
        jobId: z.string().optional().describe('Job ID to inspect. Omit to list all jobs.'),
      }),
      handler: async (params) => {
        if (!pipeline) {
          return { error: 'Intake pipeline not configured' };
        }
        const jobId = params.jobId as string | undefined;
        if (jobId) {
          const job = pipeline.getJob(jobId);
          if (!job) {
            return { error: `Job not found: ${jobId}` };
          }
          const chunks = pipeline.getChunks(jobId);
          return { job, chunks };
        }
        return { jobs: pipeline.listJobs() };
      },
    },

    // ─── Preview ──────────────────────────────────────────────────
    {
      name: 'intake_preview',
      description:
        'Preview what the pipeline would extract from a page range — parses and classifies without storing.',
      auth: 'read',
      schema: z.object({
        pdfPath: z.string().describe('Absolute path to the PDF file.'),
        title: z.string().describe('Book title for citation context.'),
        domain: z.string().describe('Knowledge domain for classification context.'),
        pageStart: z.number().describe('First page of the range (1-indexed, inclusive).'),
        pageEnd: z.number().describe('Last page of the range (1-indexed, inclusive).'),
      }),
      handler: async (params) => {
        if (!pipeline) {
          return { error: 'Intake pipeline not configured' };
        }
        const { pdfPath, title, domain, pageStart, pageEnd } = params as {
          pdfPath: string;
          title: string;
          domain: string;
          pageStart: number;
          pageEnd: number;
        };
        return pipeline.preview({ pdfPath, title, domain }, pageStart, pageEnd);
      },
    },
  ];
}
