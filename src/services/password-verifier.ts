import password from 'password-hash-and-salt';

export class PasswordVerifier {
	public constructor(private readonly secret: string) {}

	public hashWithSalt = (pass: string): Promise<string> => new Promise((resolve, reject) =>
		password(pass + this.secret).hash((error, hashedPassword) =>
			(hashedPassword ? resolve(hashedPassword) : reject(new Error(error)))));

	public verifyAgainst = (pass: string, hashedPassword: string): Promise<boolean> =>
		new Promise((resolve, reject) => {
			password(pass + this.secret).verifyAgainst(hashedPassword, (error, verified) =>
				(error ? reject(new Error(error)) : resolve(verified)));
		});
}
