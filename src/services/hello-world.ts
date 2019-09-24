import { injectable } from 'inversify';

@injectable()
export class HelloWorldService {
	public constructor() {
		console.log('Hello world inited');
	}
}
