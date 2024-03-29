import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates RIPEMD-160 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function ripemd160(data: IDataType): Promise<string>;
/**
 * Creates a new RIPEMD-160 hash instance
 */
export declare function createRIPEMD160(): Promise<IHasher>;
