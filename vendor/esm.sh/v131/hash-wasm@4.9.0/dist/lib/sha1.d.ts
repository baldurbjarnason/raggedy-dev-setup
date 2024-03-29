import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates SHA-1 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function sha1(data: IDataType): Promise<string>;
/**
 * Creates a new SHA-1 hash instance
 */
export declare function createSHA1(): Promise<IHasher>;
