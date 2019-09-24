import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { internalModule } from './internal';

export const container = new Container();

export const run = async (): Promise<Container> => {
	await container.loadAsync(internalModule);
	buildProviderModule();
	return container;
};
