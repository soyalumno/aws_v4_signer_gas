# AWS_V4_SIGNER

GAS + TypeScript + Clasp + webpackによる開発環境サンプル

## 使い方

GASのプロジェクトIDを`.clasp.json`に記入

```json
{
  "scriptId":"<scriptId>",
  "rootDir": "dist"
}
```

npmのライブラリをインストール

```bash
$ npm i
```

tscを起動

```bash
$ tsc -w
```

以下のエラーが出る場合
`node_modules/@types/google-apps-script/google-apps-script.base.d.ts`のconsole定義をコメントアウトすること

> node_modules/@types/google-apps-script/google-apps-script.base.d.ts:512:13 - error TS2403: Subsequent variable declarations must have the same type.  Variable 'console' must be of type 'Console', but here has type 'console'.
> 
> 512 declare var console: GoogleAppsScript.Base.console;
>                 ~~~~~~~
> 
>   ../../../../.nodenv/versions/16.5.0/lib/node_modules/typescript/lib/lib.dom.d.ts:17792:13
>     17792 declare var console: Console;
>                       ~~~~~~~
>     'console' was also declared here.

claspを起動

```bash
$ clasp --watch
```


