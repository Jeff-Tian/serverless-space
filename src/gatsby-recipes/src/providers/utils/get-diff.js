import diff from "jest-diff"
import chalk from "chalk"
import ansiRegex from 'ansi-regex';

export function stripAnsi(string) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }

  return string.replace(ansiRegex(), '');
}

export default function getDiff(oldVal, newVal) {
  const options = {
    aAnnotation: `Original`,
    bAnnotation: `Modified`,
    aColor: chalk.red,
    bColor: chalk.green,
    includeChangeCounts: true,
    contextLines: 3,
    expand: false,
  }

  let diffText = diff(oldVal, newVal, options)

  if (process.env.GATSBY_RECIPES_NO_COLOR) {
    diffText = stripAnsi(diffText)
  }

  return diffText
}
