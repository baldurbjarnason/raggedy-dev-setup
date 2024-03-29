import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates HMAC hash
 * @param hash Hash algorithm to use. It has to be the return value of a function like createSHA1()
 * @param key Key (string, Buffer or TypedArray)
 */
export declare function createHMAC(hash: Promise<IHasher>, key: IDataType): Promise<IHasher>;
