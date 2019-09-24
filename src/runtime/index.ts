import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

export const container = new Container();

export const run = (): Promise<Container> => new Promise((resolve, reject) => {
	try {
		container.load(buildProviderModule());
		return resolve(container);
	} catch (error) {
		return reject(error);
	}
});
