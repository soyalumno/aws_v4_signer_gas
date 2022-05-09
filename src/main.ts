import url from 'url';
import cryptoJs from 'crypto-js';

/** AWS署名バージョン4プロセス */
class AwsV4Signer {

  key: string;
  region: string;
  service: string;
  method: string;
  url: string;
  hostname: string | null;
  payload: {[key: string]: string};
  key_id: string;
  signature?: cryptoJs.lib.WordArray;
  credential_scope?: string;
  signed_headers?: string;
  dateStamp: string | undefined;
  canonical_headers?: string;
  x_amz_date?: string;

  /** API実行用にパラメータを初期化 */
  constructor(options: any) {
    this.key = options.key || '';
    this.region = options.region || 'us-west-2';
    this.service = options.service || 'execute-api';
    this.method = options.method || 'GET';
    this.url = options.url || 'http://example.com';
    this.hostname = url.parse(this.url).hostname;
    this.payload = options.payload || undefined;
    this.key_id = options.key_id || '';
  }

  /**
   * Authorizationヘッダーの取得
   */
  get authHeader() {
    // 署名が無ければ作成
    const sign = this.signature || this.sign();
    return `AWS4-HMAC-SHA256 Credential=${this.key_id}/${this.credential_scope}, SignedHeaders=${this.signed_headers}, Signature=${sign}`;
  }

  /**
   * 現在時刻をセット
   */
  setDatestamp() {
    this.x_amz_date = new Date().toISOString().replace(/[-|:]/g, '').replace(/\..+/, 'Z');
    this.dateStamp = this.x_amz_date.split('T')[0];
    this.credential_scope = `${this.dateStamp}/${this.region}/${this.service}/aws4_request`;
    return this;
  }

  /**
   * 署名を取得
   */
  sign() {
    if(!this.dateStamp)
      this.setDatestamp();

    // 署名の作成
    const kDate = cryptoJs.HmacSHA256((this.dateStamp as string), `AWS4${this.key}`);
    const kRegion = cryptoJs.HmacSHA256(this.region, kDate);
    const kService = cryptoJs.HmacSHA256(this.service, kRegion);
    const kSigning = cryptoJs.HmacSHA256('aws4_request', kService);
    return this.signature = cryptoJs.HmacSHA256(this.str_to_sign, kSigning);
  }

  /**
   * 正規リクエストの取得
   */
  get canonical_req() {
    const headers: {[key: string]: string | null} = {
      host: this.hostname
    };

    this.signed_headers = Object.keys(headers).sort().join(';');
    this.canonical_headers = `${Object.keys(headers).sort()
      .map((key) => [key, headers[key]].join(':'))
      .join('\n')}\n`;

    const canonical_request = [
      this.method,  // method
      url.parse(this.url).pathname,  // URI
      url.parse(this.url).query,     // query string
      this.canonical_headers,    // headers
      this.signed_headers,
      cryptoJs.SHA256(this.payload ? JSON.stringify(this.payload) : '').toString(),     // payload hash
    ].join('\n');

    return canonical_request;
  }

  /**
   * 署名用文字列の作成
   */
  get str_to_sign() {
    // 署名用文字列の作成
    const string_to_signature = [
      'AWS4-HMAC-SHA256',
      this.x_amz_date,
      this.credential_scope,
      cryptoJs.SHA256(this.canonical_req).toString()
    ].join('\n');
    return string_to_signature;
  }
}

function create(options: any) {
  return new AwsV4Signer(options);
}

global.create = create;

