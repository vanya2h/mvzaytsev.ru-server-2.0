import 'reflect-metadata';
import { run } from '~/runtime';
import { App } from './services/app';

run().then(container => {
	container.get(App);
});
