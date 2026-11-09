import { chapterIntro } from './chapters/intro.js';
import { chapter01 } from './chapters/ch01.js';
import { chapter02 } from './chapters/ch02.js';
import { chapter03 } from './chapters/ch03.js';
import { chapter04 } from './chapters/ch04.js';
import { chapter05 } from './chapters/ch05.js';
import { chapter06 } from './chapters/ch06.js';
import { chapter07 } from './chapters/ch07.js';
import { chapter08 } from './chapters/ch08.js';
import { chapter09 } from './chapters/ch09.js';
import { chapter10 } from './chapters/ch10.js';
import { chapter11 } from './chapters/ch11.js';
import { chapter12 } from './chapters/ch12.js';

export const CHAPTERS_DATA = {
    intro: chapterIntro,
    ch01: chapter01,
    ch02: chapter02,
    ch03: chapter03,
    ch04: chapter04,
    ch05: chapter05,
    ch06: chapter06,
    ch07: chapter07,
    ch08: chapter08,
    ch09: chapter09,
    ch10: chapter10,
    ch11: chapter11,
    ch12: chapter12
};

export function getChapterData(id) {
    return CHAPTERS_DATA[id] || null;
}
