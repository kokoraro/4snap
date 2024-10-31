// sleep method
export const sleep = async (sec = 1) => {
  return new Promise((res) => setTimeout(res, sec * 1000));
};

export const isEqual = (a: string, b: string) => a === b;

export const capitalizeWord = (wrd: string) => {
  if (wrd.length === 0 || typeof wrd === "undefined" || wrd === "") return wrd;
  const splited = wrd.split("");
  const first = splited[0].toUpperCase();
  const last = wrd.slice(1);
  const comb = first + last;
  return comb;
};

export const isEmpty = (param: string | null | any) =>
  param === null || typeof param === "undefined" || param.length == 0;

export const capitalizeFirstCharacter = (str: string) => {
  if (isEmpty(str)) return str;
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};
export const returnFirstAndLastLetter = (str: string) => {
  const { first, last } = splitFullname(str);
  const firstLetter = capitalizeFirstCharacter(first.slice(0, 1));
  const lastLetter = capitalizeFirstCharacter(last.slice(0, 1));

  return { firstLetter, lastLetter };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const splitFullname = (fullname: string) => {
  const splitted = fullname.split(" ");
  const len = splitted.length;
  let first = splitted[0];
  let last = len > 1 ? splitted[1] : "";

  return { first, last };
};

export const isOnlyNumbers = (string: string) => {
  const regex = /^[0-9]+$/;
  const isNum = regex.test(string);
  return isNum;
};

export function splitThread(
  max_char: number,
  content: string
): { id: number; value: string }[] {
  if (content.length === 0) return [{ id: 0, value: content }];
  const splittedThread = [];
  let count = 0;
  if (content.length > max_char) {
    for (let i = 0; i < content.length; i += max_char) {
      const sliced = content.slice(i, max_char + i);
      splittedThread.push({ id: count, value: sliced });
      count += 1;
    }
    return splittedThread;
  }
  splittedThread.push({ id: 0, value: content });
  return splittedThread;
}

export function replaceTagsWithNewLine(text: string): string {
  return text.replaceAll(/<\/div>|<br \/>|<br>|<div>/gi, "\n");
}

export function formatStringToMarkdown(content) {
  // const linkRegex = /(https?:\/\/[^\s]+)/g;
  const maxShowText = 400;
  const imageRegex =
    /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp)(\?[^\s]+)?)/gi;

  const matchAllImageUrl = content.match(imageRegex) || [];
  const slicedContent =
    content.length > maxShowText
      ? content.slice(0, maxShowText) + "......."
      : content;
  let firstImage = matchAllImageUrl[0] ?? "";
  const finalContent = `${slicedContent}`;
  return { finalContent, availableImage: firstImage };
}

export const copyToClipboard = (content: string) => {
  navigator && navigator.clipboard.writeText(content);
};

export function genRandNum(len: number = 10) {
  const char = "01234567890abcdegh".split("");
  let generated = "";
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * char.length);
    generated += char[rand];
  }
  return generated;
}
