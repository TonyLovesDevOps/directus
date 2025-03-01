import { SchemaOverview } from '@directus/shared/types';
import knex, { Knex } from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { UsersService, ItemsService } from '.';
import { InvalidPayloadException } from '../exceptions';

jest.mock('../../src/database/index', () => {
	return { __esModule: true, default: jest.fn(), getDatabaseClient: jest.fn().mockReturnValue('postgres') };
});

const testSchema = {
	collections: {
		directus_users: {
			collection: 'directus_users',
			primary: 'id',
			singleton: false,
			sortField: null,
			note: null,
			accountability: null,
			fields: {
				id: {
					field: 'id',
					defaultValue: null,
					nullable: false,
					generated: true,
					type: 'integer',
					dbType: 'integer',
					precision: null,
					scale: null,
					special: [],
					note: null,
					validation: null,
					alias: false,
				},
			},
		},
	},
	relations: [],
} as SchemaOverview;

describe('Integration Tests', () => {
	let db: jest.Mocked<Knex>;
	let tracker: Tracker;

	beforeAll(async () => {
		db = knex({ client: MockClient }) as jest.Mocked<Knex>;
		tracker = getTracker();
	});

	afterEach(() => {
		tracker.reset();
	});

	describe('Services / Users', () => {
		describe('updateOne', () => {
			it.each(['provider', 'external_identifier'])(
				'should throw InvalidPayloadException for non-admin users when updating "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
						accountability: { role: 'test', admin: false },
					});

					const promise = service.updateOne(1, { [field]: 'test' });

					expect.assertions(2); // to ensure both assertions in the catch block are reached

					try {
						await promise;
					} catch (err: any) {
						expect(err.message).toBe(`You can't change the "${field}" value manually.`);
						expect(err).toBeInstanceOf(InvalidPayloadException);
					}
				}
			);

			it.each(['provider', 'external_identifier'])('should allow admin users to update "%s" field', async (field) => {
				const service = new UsersService({
					knex: db,
					schema: testSchema,
					accountability: { role: 'admin', admin: true },
				});

				const promise = service.updateOne(1, { [field]: 'test' });

				await expect(promise).resolves.not.toThrow();
			});

			it.each(['provider', 'external_identifier'])(
				'should allow null accountability to update "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
					});

					const promise = service.updateOne(1, { [field]: 'test' });

					await expect(promise).resolves.not.toThrow();
				}
			);
		});

		describe('updateMany', () => {
			it.each(['provider', 'external_identifier'])(
				'should throw InvalidPayloadException for non-admin users when updating "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
						accountability: { role: 'test', admin: false },
					});

					const promise = service.updateMany([1], { [field]: 'test' });

					expect.assertions(2); // to ensure both assertions in the catch block are reached

					try {
						await promise;
					} catch (err: any) {
						expect(err.message).toBe(`You can't change the "${field}" value manually.`);
						expect(err).toBeInstanceOf(InvalidPayloadException);
					}
				}
			);

			it.each(['provider', 'external_identifier'])('should allow admin users to update "%s" field', async (field) => {
				const service = new UsersService({
					knex: db,
					schema: testSchema,
					accountability: { role: 'admin', admin: true },
				});

				const promise = service.updateMany([1], { [field]: 'test' });

				await expect(promise).resolves.not.toThrow();
			});

			it.each(['provider', 'external_identifier'])(
				'should allow null accountability to update "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
					});

					const promise = service.updateMany([1], { [field]: 'test' });

					await expect(promise).resolves.not.toThrow();
				}
			);
		});

		describe('updateByQuery', () => {
			it.each(['provider', 'external_identifier'])(
				'should throw InvalidPayloadException for non-admin users when updating "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
						accountability: { role: 'test', admin: false },
					});

					jest.spyOn(ItemsService.prototype, 'getKeysByQuery').mockImplementation(jest.fn(() => Promise.resolve([1])));

					const promise = service.updateByQuery({}, { [field]: 'test' });

					expect.assertions(2); // to ensure both assertions in the catch block are reached

					try {
						await promise;
					} catch (err: any) {
						expect(err.message).toBe(`You can't change the "${field}" value manually.`);
						expect(err).toBeInstanceOf(InvalidPayloadException);
					}
				}
			);

			it.each(['provider', 'external_identifier'])('should allow admin users to update "%s" field', async (field) => {
				const service = new UsersService({
					knex: db,
					schema: testSchema,
					accountability: { role: 'admin', admin: true },
				});

				jest.spyOn(ItemsService.prototype, 'getKeysByQuery').mockImplementation(jest.fn(() => Promise.resolve([1])));

				const promise = service.updateByQuery({}, { [field]: 'test' });

				await expect(promise).resolves.not.toThrow();
			});

			it.each(['provider', 'external_identifier'])(
				'should allow null accountability to update "%s" field',
				async (field) => {
					const service = new UsersService({
						knex: db,
						schema: testSchema,
					});

					jest.spyOn(ItemsService.prototype, 'getKeysByQuery').mockImplementation(jest.fn(() => Promise.resolve([1])));

					const promise = service.updateByQuery({}, { [field]: 'test' });

					await expect(promise).resolves.not.toThrow();
				}
			);
		});
	});
});
