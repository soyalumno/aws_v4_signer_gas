/**
 * onEditで渡されるイベントオブジェクトの定義
 */
interface EditEvent {
  authMode: GoogleAppsScript.Script.AuthMode,
  oldValue: any,
  range: GoogleAppsScript.Spreadsheet.Range,
  source: GoogleAppsScript.Spreadsheet.Spreadsheet,
  triggerUid: number,
  user: string,
  value: any
}

interface AwsV4Signer {
  key: string,
}

