import {customAlphabet} from 'nanoid';

// 默认字符集和长度
const DEFAULT_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_SIZE = 17;

// 生成随机字符串函数
const generate = (alphabet: string = DEFAULT_ALPHABET, size: number = DEFAULT_SIZE): string => {
  const nanoid = customAlphabet(alphabet, size);
  return nanoid();
};

// 生成配方表ID
export const generateSampleFormulaId = (size: number = DEFAULT_SIZE): string => {
  const ss = `CSF-${generate(DEFAULT_ALPHABET, size)}`;
  console.log(ss);
  return ss
  // return `CSF-${generate(DEFAULT_ALPHABET, size)}`;
};