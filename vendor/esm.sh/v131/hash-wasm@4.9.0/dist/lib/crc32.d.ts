import { IHasher } from './WASMInterface.d.ts';
import { IDataType } from './util.d.ts';
/**
 * Calculates CRC-32 hash
 * @param data Input data (string, Buffer or TypedArray)
 * @returns Computed hash as a hexadecimal string
 */
export declare function crc32(data: IDataType): Promise<string>;
/**
 * Creates a new CRC-32 hash instance
 */
export declare function createCRC32(): Promise<IHasher>;
