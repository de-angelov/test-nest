import { PulsarClient } from '@jobber/pulsar';
import { FibonacciData } from './fibonacci-data.message';
import { AbstractJob } from '../abstract-job';
import { Job } from '../../decorators/job.decorator';

@Job({
  name: 'Fibonacci',
  description: 'Generate a Fibonacci sequence and store it in the DB.',
})
export class FibonacciJob extends AbstractJob<FibonacciData> {
  protected messageClass = FibonacciData;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
