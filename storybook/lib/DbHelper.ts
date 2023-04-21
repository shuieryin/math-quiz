import { StoreConfig, StoreName, StoreRecord } from "./types";
import {
	incorrectQuestionStoreConfig,
	quizReportStoreConfig
} from "./DbStoreConfig";
import { V9_TO_V10 } from "./MigrateDbStoreUtils";

if (!window.indexedDB) {
	window["indexedDB"] =
		window["mozIndexedDB"] ||
		window["webkitIndexedDB"] ||
		window["msIndexedDB"];
}

if (!window.IDBTransaction) {
	window.IDBTransaction = window["webkitIDBTransaction"] ||
		window["msIDBTransaction"] || { READ_WRITE: "readwrite" };
}

if (!window.IDBKeyRange) {
	window.IDBKeyRange = window["webkitIDBKeyRange"] || window["msIDBKeyRange"];
}

if (!window.indexedDB) {
	console.error(
		"Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
	);
}

export const dbName = "math-quiz";
export const dbVersion = 10;

const requestDb = () => indexedDB.open(dbName, dbVersion);

const createStore = (db: IDBDatabase, storeConfig: StoreConfig) => {
	const { name, options, indexes } = storeConfig;
	const objectStore = db.createObjectStore(name, options);

	for (const indexName in indexes) {
		const indexOptions = indexes[indexName];
		objectStore.createIndex(indexName, indexName, indexOptions);
	}

	objectStore.transaction.oncomplete = () => {
		console.log(`${name} store created.`);
	};

	objectStore.transaction.onerror = () => {
		console.log(`Error ${name} store created.`);
	};
};

export const getUpgradeStore = (
	transaction: IDBTransaction,
	storeName: StoreName
) => transaction.objectStore(storeName);

export const initDb = () => {
	const request = requestDb();
	return new Promise<void>(resolve => {
		request.onerror = () => {
			console.error(`Error opening database [${dbName}].`);
			resolve();
		};

		request.onupgradeneeded = async event => {
			const { target, oldVersion } = event;
			const db = target["result"] as IDBDatabase;

			if (oldVersion === 0) {
				createStore(db, incorrectQuestionStoreConfig);
				createStore(db, quizReportStoreConfig);
				resolve();
				return;
			}

			await V9_TO_V10(event);
			resolve();
		};

		request.onsuccess = async () => {
			resolve();
		};
	});
};

export const addRecord = (storeName: StoreName, record: StoreRecord) => {
	const request = requestDb();

	return new Promise<void>(resolve => {
		request.onerror = () => {
			console.error(
				`Error adding record to store [${storeName}] in database [${dbName}].`,
				record
			);
			resolve();
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction([storeName], "readwrite");
			const objectStore = transaction.objectStore(storeName);
			const objectStoreRequest = objectStore.put(record);

			objectStoreRequest.onsuccess = () => {
				console.log(
					`added record to [${storeName}] in database [${dbName}]`,
					record
				);
				resolve();
			};

			objectStoreRequest.onerror = () => {
				console.error(
					`Error adding record to store [${storeName}] in database [${dbName}]`,
					record
				);
				resolve();
			};
		};
	});
};

export const removeRecord = (storeName: StoreName, key: string) => {
	const request = requestDb();
	return new Promise<void>(resolve => {
		request.onerror = () => {
			console.error(
				`Error removing record to store [${storeName}] in database [${dbName}] by key [${key}].`
			);
			resolve();
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction([storeName], "readwrite");
			const objectStore = transaction.objectStore(storeName);
			const objectStoreRequest = objectStore.delete(key);

			objectStoreRequest.onsuccess = () => {
				console.log(
					`removed record in [${storeName}] in database [${dbName}] by key [${key}]`
				);
				resolve();
			};

			objectStoreRequest.onerror = () => {
				console.error(
					`Error removing record to store [${storeName}] in database [${dbName}] by key [${key}].`
				);
				resolve();
			};
		};
	});
};

export const getRecord = <Record extends StoreRecord>(
	storeName: StoreName,
	key
): Promise<Record> => {
	const request = requestDb();
	return new Promise<Record>(resolve => {
		request.onerror = () => {
			console.error(
				`Error getting record from store [${storeName}] in database [${dbName}] by key [${key}].`
			);
			resolve(undefined);
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction([storeName], "readwrite");
			const objectStore = transaction.objectStore(storeName);
			const objectStoreRequest = objectStore.get(key);

			objectStoreRequest.onsuccess = () => {
				resolve(objectStoreRequest.result);
			};

			objectStoreRequest.onerror = () => {
				console.error(
					`Error getting record from store [${storeName}] in database [${dbName}] by key [${key}].`
				);
				resolve(undefined);
			};
		};
	});
};

export const forEachRecord = <Record extends StoreRecord>(
	storeName: StoreName,
	callback: (record: Record) => void | Promise<void>
) => {
	const request = requestDb();
	return new Promise<void>(resolve => {
		request.onerror = () => {
			console.error(
				`Error traversing store [${storeName}] in database [${dbName}].`
			);
			resolve();
		};

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction([storeName], "readonly");
			const objectStore = transaction.objectStore(storeName);

			const cursorRequest = objectStore.openCursor();

			cursorRequest.onsuccess = async event => {
				const cursor = event.target["result"] as IDBCursor;
				if (cursor) {
					await callback(cursor["value"]);
					cursor.continue();
				} else {
					resolve();
				}
			};

			cursorRequest.onerror = () => {
				console.error(
					`Error traversing store [${storeName}] in database [${dbName}].`
				);
				resolve();
			};
		};
	});
};
