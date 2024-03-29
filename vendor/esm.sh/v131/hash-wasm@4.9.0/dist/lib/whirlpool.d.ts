import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates Whirlpool hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function whirlpool(data: IDataType): Promise<string>;
/**
 * Creates a new Whirlpool hash instance
 */
export declare function createWhirlpool(): Promise<IHasher>;
