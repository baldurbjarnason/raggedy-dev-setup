import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates SM3 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function sm3(data: IDataType): Promise<string>;
/**
 * Creates a new SM3 hash instance
 */
export declare function createSM3(): Promise<IHasher>;
