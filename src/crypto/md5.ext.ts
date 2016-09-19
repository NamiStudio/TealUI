﻿/**
 * @fileOverview MD5 加密扩展
 * @author xuld@vip.qq.com
 */

import './md5';
declare function unescape(value: string): string;
export declare module md5 {
    function calc(value: number[], length: number): number[];
    function raw(value: string): number[];
    function stringToBinary(value: string): number[];
    function binaryToString(value: number[]): string;
}

export module md5 {

    /**
     * 将字节数组转为 Base64。
     * @param value 要解码的二进制数组。
     * @returns 返回字符串。
     * @private
     */
    export function binaryToBase64(value: number[], base64Padding?: string) {
        base64Padding = base64Padding || "";

        let result = "";
        for (let i = 0; i < value.length * 4; i += 3) {
            const triplet = (value[i >> 2] >> i % 4 * 8 & 255) << 16 | (value[i + 1 >> 2] >> (i + 1) % 4 * 8 & 0xff) << 8 | value[i + 2 >> 2] >> (i + 2) % 4 * 8 & 0xff;
            for (let j = 0; j < 4; j++) {
                result += i * 8 + j * 6 > value.length * 32 ? base64Padding : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
            }
        }
        return result;
    }

    /**
     * 使用 MD5 和 Base64 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.base64Md5("abc") // "kAFQmDzST7DWlj99KOF/cg"
     */
    export function base64(value: string) {
        return md5.binaryToBase64(md5.raw(value));
    }

    /**
     * 使用 HMAC-MD5 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
     */
    export function hmac(value: string, key: string) {
        return md5.binaryToString(md5.hmacRaw(value, key));
    }

    /**
     * 使用 HMAC-MD5 和 Base64 算法加密指定字符串。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @returns 返回加密后的字符串，其中只包含小写字母。
     * @example md5.base64HmacMd5("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
     */
    export function hmacBase64(value: string, key: string) {
        return md5.binaryToBase64(md5.hmacRaw(value, key));
    }

    /**
     * 执行 HMAC-MD5 加密算法。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @private
     */
    export function hmacRaw(value: string, key: string) {
        value = unescape(encodeURIComponent(value));
        key = unescape(encodeURIComponent(key));
        let bkey = md5.stringToBinary(key);
        if (bkey.length > 16) bkey = md5.calc(bkey, key.length * 8);

        let ipad: number[] = [];
        let opad: number[] = [];
        for (let i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        return md5.calc(opad.concat(md5.calc(ipad.concat(md5.stringToBinary(value)), 512 + value.length * 8)), 512 + 128);



    }

}
