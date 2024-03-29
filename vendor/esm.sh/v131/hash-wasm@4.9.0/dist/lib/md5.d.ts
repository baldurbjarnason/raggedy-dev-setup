import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates MD5 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function md5(data: IDataType): Promise<string>;
/**
 * Creates a new MD5 hash instance
 */
export declare function createMD5(): Promise<IHasher>;
