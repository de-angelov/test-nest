import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
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

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    this.jobs = await this.discoveryService.providersWithMetaAtKey(
      JOB_METADATA_KEY
    );
  }

  getJobs() {
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

    await job.discoveredClass.instance.execute(finalData, job.meta.name);
    return job.meta;
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
