﻿/**
 * @fileOverview 处理查询字符串
 * @author xuld@vip.qq.com
 */

/**
 * 解析查询字符串为对象。
 * @param value 要解析的字符串。
 * @returns 返回解析后的对象。
 * @example parseQuery("a=1&b=3") // {a: '1', b: '3'}
 * @example parseQuery("?a=1&a=r") // {a: ['1', 'r']}
 */
export function parseQuery(value: string) {
    let result: { [key: string]: any } = {};
    if (value) {
        const arr = value.replace(/^\?/, "").replace(/\+/g, '%20').split('&');
        for (let i = 0; i < arr.length; i++) {
            const t = arr[i].indexOf('=');
            let key = t >= 0 ? arr[i].substr(0, t) : arr[i];
            let value = arr[i].substr(key.length + 1);

            try {
                key = decodeURIComponent(key);
            } catch (e) { }

            try {
                value = decodeURIComponent(value);
            } catch (e) { }

            if (result.hasOwnProperty(key)) {
                if (result[key].constructor === String) {
                    result[key] = [result[key], value];
                } else {
                    result[key].push(value);
                }
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

/**
 * 将指定对象格式化为查询参数字符串。
 * @param obj 要格式化的对象。
 * @returns 返回格式化后的字符串。
 * @example stringifyQuery({ a: "2", c: "4" }) // "a=2&c=4"
 * @example stringifyQuery({ a: [2, 4] }) // "a=2&a=4"
 */
export function stringifyQuery(obj: any, name?: string) {
    if (obj && typeof obj === 'object') {
        let t = [];
        for (const key in obj) {
            t.push(stringifyQuery(obj[key], name || key));
        }
        obj = t.join('&');
    } else {
        obj = (name ? encodeURIComponent(name) + "=" : "") + encodeURIComponent(obj);
    }
    return obj as string;
}

/**
 * 获取当前页面的查询参数。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("a")
 */
export function getQuery(name: string): string;

/**
 * 获取指定地址的查询参数。
 * @param url 要获取的地址。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("?a=b", "a") // "b"
 * @example getQuery("?a=b", "abc") // undefined
 */
export function getQuery(url: string, name: string): string;

/**
 * 获取当前页面或指定地址的查询参数。
 * @param url 要获取的地址，默认为当前页面的地址。
 * @param name 要获取的查询字符串名。
 * @returns 返回查询参数值。如果获取不到则返回 undefined。
 * @example getQuery("?a=b", "a") // "b"
 * @example getQuery("?a=b", "abc") // undefined
 */
export function getQuery(url: string, name?: string) {
    if (arguments.length < 2) {
        name = url;
        url = location.href
    }
    let match = /\?([^#]*)(#|$)/.exec(url);
    if (match && (match = new RegExp("(^|&)" + encodeURIComponent(name).replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(match[1]))) {
        try {
            match[2] = decodeURIComponent(match[2]);
        } catch (e) { }
        return match[2];
    }
}

/**
 * 在当前页面的地址追加（如果存在则替换）查询字符串参数。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example setQuery("b", "c")
 */
export function setQuery(name: string, value: string): string;

/**
 * 在指定的地址追加（如果存在则替换）查询字符串参数。
 * @param url 要追加的地址。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example setQuery("a.html", "b", "c") // "a.html?b=c"
 * @example setQuery("a.html?b=d", "b", "c") // "a.html?b=c"
 * @example setQuery("a.html?b=d", "add", "val") // "a.html?b=d&add=val"
 */
export function setQuery(url: string, name: string, value: string): string;

/**
 * 在当前页面或指定的地址追加（如果存在则替换）查询字符串参数。
 * @param url 要追加的地址，默认为当前页面的地址。
 * @param name 要追加或替换的查询参数名。
 * @param value 要追加或替换的查询参数值。
 * @example setQuery("a.html", "b", "c") // "a.html?b=c"
 * @example setQuery("a.html?b=d", "b", "c") // "a.html?b=c"
 * @example setQuery("a.html?b=d", "add", "val") // "a.html?b=d&add=val"
 */
export function setQuery(url: string, name: string, value?: string) {
    if (arguments.length < 3) {
        value = name;
        name = url;
        url = location.href
    }
    name = encodeURIComponent(name);
    value = name + '=' + encodeURIComponent(value);
    let match = /^(.*?)(\?.+?)?(#.*)?$/.exec(url);
    match[0] = '';
    match[2] = match[2] && match[2].replace(new RegExp('([?&])' + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '(=[^&]*)?(&|$)'), (_: string, q1: string, __: string, q2: string) => {
        // 标记已解析过。
        name = "";
        return q1 + value + q2;
    });
    if (name) match[2] = (match[2] ? match[2] + '&' : '?') + value;
    return match.join('');
}
