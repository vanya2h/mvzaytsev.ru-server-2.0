import bcrypt from 'bcrypt';

export class HashifierService {
	public constructor(private readonly secret: string) {}

	public hashWithSalt = async (password: string): Promise<string> => {
		const salt = await this.getSalt();

		return new Promise((resolve, reject) => {
			bcrypt.hash(password, salt, (error, hash) => (
				error ? reject(error) : resolve(hash)
			));
		});
	};

	public getSalt = (rounds: number = 13): Promise<string> => new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, (error, salt) => (error ? reject(error) : resolve(salt)));
	});
}
