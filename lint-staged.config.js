/**
 * @see https://github.com/lint-staged/lint-staged?tab=readme-ov-file#typescript
 * @type  { import('lint-staged').Configuration }
 */
const config = {
  'package.json': ['npx sort-package-json'],
  'src/**/!(*.spec).ts': ['tslint --project ./tsconfig.json -t codeFrame --fix'],
  '*': ['npx prettier --write --ignore-unknown'],
}

export default config
