import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JOB_METADATA_KEY } from './decorators/job.decorator';
import { JobMetadata } from './interfaces/job-metadata.interface';
import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { AbstractJob } from './jobs/abstract-job';
import { readFileSync } from 'fs';
import { UPLOAD_FILE_PATH } from './uploads/upload';
import { PrismaService } from './prisma/prisma.service';
import { JobStatus } from './models/job-status.enum';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly prismaService: PrismaService
  ) {}

  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey(
      JOB_METADATA_KEY
    );
  }

  async getJobs() {
    return this.prismaService.job.findMany();
  }

  async getJob(jobId: number) {
    return this.prismaService.job.findUnique({
      where: { id: jobId },
    });
  }

  getJobsMetadata() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(name: string, data: any) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) {
      throw new BadRequestException(`Job ${name} does not exists.`);
    }
    if (!(job.discoveredClass.instance instanceof AbstractJob)) {
      throw new InternalServerErrorException(
        'Job is not an instance of AbstractJob'
      );
    }

    const finalData = data.fileName ? this.getFile(data.fileName) : data;

    return job.discoveredClass.instance.execute(finalData, job.meta.name);
  }

  async acknowledge(jobId: number) {
    const job = await this.prismaService.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new BadRequestException(`Job with ID ${jobId} does not exist.`);
    }

    if (job.ended) {
      return;
    }

    const updatedJob = await this.prismaService.job.update({
      where: { id: jobId },
      data: { completed: { increment: 1 } },
    });

    if (updatedJob.completed === job.size) {
      await this.prismaService.job.update({
        where: { id: jobId },
        data: {
          status: JobStatus.COMPLETED,
          ended: new Date(),
        },
      });
    }
  }

  private getFile(fileName?: string) {
    if (!fileName) {
      return undefined;
    }

    try {
      return JSON.parse(
        readFileSync(`${UPLOAD_FILE_PATH}/${fileName}`, 'utf-8')
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to read file: ' + fileName
      );
    }
  }
}
