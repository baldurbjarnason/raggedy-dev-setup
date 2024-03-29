import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates MD4 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function md4(data: IDataType): Promise<string>;
/**
 * Creates a new MD4 hash instance
 */
export declare function createMD4(): Promise<IHasher>;
