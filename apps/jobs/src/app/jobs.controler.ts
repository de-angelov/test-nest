import { Controller } from '@nestjs/common';
import {
  JobsServiceControllerMethods,
  JobsServiceController,
  AcknowledgeRequest,
} from '@jobber/grpc';
import { JobsService } from './jobs.service';

@Controller()
@JobsServiceControllerMethods()
export class JobsController implements JobsServiceController {
  constructor(private readonly jobsService: JobsService) {}

  async acknowledge(request: AcknowledgeRequest) {
    await this.jobsService.acknowledge(request.jobId);
  }
}
