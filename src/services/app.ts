import { injectable } from 'inversify';
import { HelloWorldService } from '~/services/hello-world';

@injectable()
export class App {
	public constructor(private readonly helloWorld: HelloWorldService) {
		console.log('Hello world inited');
	}
}
