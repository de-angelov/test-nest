import { PulsarClient } from '@jobber/pulsar';
import { FibonacciData } from './fibonacci-data.interface';
import { AbstractJob } from '../abstract-job';
import { Job } from '../../decorators/job.decorator';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonacci sequence and store it in the DB.',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
