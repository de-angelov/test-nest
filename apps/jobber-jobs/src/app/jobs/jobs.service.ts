import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { JOB_METADATA_KEY } from "../decorators/job.decorator";
import { JobMetadata } from "../interfaces/job-metadata.interface";
import { DiscoveredClassWithMeta, DiscoveryService } from "@golevelup/nestjs-discovery";
import { AbstractJob } from "./abstract-job";

@Injectable()
export class JobsService implements OnModuleInit {
    private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];

    constructor(
        private readonly discoveryService: DiscoveryService
    ){

    }

    async onModuleInit() {
        this.jobs = await this.discoveryService.providersWithMetaAtKey(JOB_METADATA_KEY);
    }

    getJobs(){
        return this.jobs.map(job => job.meta);
    }

    async executeJob(name: string) {
        const job = this.jobs.find(job => job.meta.name === name);
        if(!job){
            throw new BadRequestException(`Job ${name} does not exists.`); 
        }
        await (job.discoveredClass.instance as AbstractJob).execute();
        return job.meta;
    }
}