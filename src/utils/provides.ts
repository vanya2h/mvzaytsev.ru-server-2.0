/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces as inversifyInterfaces } from 'inversify';
import { fluentProvide } from 'inversify-binding-decorators';

export const provides = (
	serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>,
): ((target: any) => any
) => fluentProvide(serviceIdentifier)
	.inSingletonScope()
	.done();
