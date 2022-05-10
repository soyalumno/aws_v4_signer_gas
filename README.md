# AWS_V4_SIGNER

GASからSP-APIを実行するための[署名](https://docs.aws.amazon.com/ja_jp/general/latest/gr/signature-version-4.html)を作成します

## Usage

以下のスクリプトIDをGASのライブラリに追加してください

`1ujoWwBfuTunHojxGbF4gZkaP4FmKC-RB3oI5c9KqUPUUUO5Bb2P8UEs_` as `aws_v4_signer`

![](https://i.gyazo.com/84424ee3bd081c9b830c14f6f1ba2925.png)

## Example

### トークンの生成

```javascript
// リフレッシュトークンの生成
function getToken() {
  const params = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: '<REFRESH_TOKEN>',
      client_id: '<CLIENT_ID>',
      client_secret: '<CLIENT_SECRET>',
    }),
  };
  const resp = UrlFetchApp.fetch('https://api.amazon.com/auth/o2/token', params);
  const token = JSON.parse(resp.getContentText()).access_token;
  return token;
}
```

### GETリクエスト

```javascript
// エンドポイント
const SPAPI_EP = 'https://sellingpartnerapi-fe.amazon.com';

// GETリクエストのサンプル
function sample_get() {
  // create token
  const token = getToken();

  // create signer
  const url = SPAPI_EP + '/sellers/v1/marketplaceParticipations';
  const options = {
    region: 'us-west-2',
    service: 'execute-api',
    method: 'GET',
    url,

    key: '<SECRET_ACCESS_KEY>',
    key_id: '<ACCESS_KEY_ID>'
  };
  const signer = aws_v4_signer.create(options);
  signer.sign();

  // API request
  const params = {
    method: 'get',
    headers: {
      'x-amz-date': signer.x_amz_date,
      Authorization: signer.authHeader,
      'x-amz-access-token': token,
    },
    payload: {}, // getリクエストでもpayloadを渡すこと
  };
  const resp = UrlFetchApp.fetch(url, params);
  const data = JSON.parse(resp.getContentText());
  console.log(data);
}
```

### POSTリクエスト

```javascript
// エンドポイント
const SPAPI_EP = 'https://sellingpartnerapi-fe.amazon.com';

// POSTリクエストのサンプル
function sample_post() {
  // create token
  const token = getToken();

  // request body
  const url = SPAPI_EP + '/products/fees/v0/items/B07WXL5YPW/feesEstimate';
  const payload = {
    FeesEstimateRequest: {
      MarketplaceId: 'A1VC38T7YXB528',
      PriceToEstimateFees: {
        ListingPrice: { CurrencyCode:'JPY', Amount: 980 }
      },
      Identifier: 'testId'
    }
  };
  const options = {
    region: 'us-west-2',
    service: 'execute-api',
    method: 'POST',
    url,
    payload,

    key: '<SECRET_ACCESS_KEY>',
    key_id: '<ACCESS_KEY_ID>'
  };

  // create signer
  const signer = aws_v4_signer.create(options);
  signer.sign();

  // API request
  const params = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json', // UrlFetchAppにはJSON形式で渡すこと
      'x-amz-date': signer.x_amz_date,
      Authorization: signer.authHeader,
      'x-amz-access-token': token,
    },
    payload: JSON.stringify(payload), // UrlFetchAppにはJSON形式で渡すこと
  };
  const resp = UrlFetchApp.fetch(url, params);
  const data = JSON.parse(resp.getContentText());
  console.log(data);
}
```

