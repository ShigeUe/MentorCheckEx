import { MCEElement }  from "./mceelement";
import { Settings } from "./settings";
import { Util } from "./util";

export class MentorCheckEx
{
  public cloud9_url = '#';
  public awsWindow: Window = window;
  public settings: Settings;

  constructor() {
    // 空のメッセージを送ることで、Service Workerを起こしてバージョンアップの確認をさせる
    chrome.runtime.sendMessage({});
    this.settings = new Settings();
  }

  // 共通のウィンドウ名で開く
  private OpenNamedWindow(url: string): WindowProxy {
    return window.open(url, 'AWSOpenedFromMentorCheckEx')!;
  }

  // 画面からusernameとpasswordを取得する
  private getUsernameAndPassword() {
    // AWSのリンクの直後のDIVの中にユーザー名とパスワードが入っている
    const aws_info_ele = Util.query<HTMLDivElement>('a[href*="signin.aws.amazon.com/console"] + div');
    if (aws_info_ele) {
      const aws_info = aws_info_ele.innerText.split('\n');
      this.settings.username = aws_info[1].split(' ')[1];
      this.settings.password = aws_info[2].split(' ')[1];
    }
  }
  // 「自動でCloud9を開く」ボタンを設置するための設定をする
  async settingCloud9() {
    // AWSのリンクが無ければ終了する
    const aws = Util.query<HTMLAnchorElement>('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]', true);
    if (aws === null) {
      return;
    }
    // 設定に username が無ければ、画面から取得する
    if (!('username' in this.settings) || !this.settings.username) {
      this.getUsernameAndPassword();
      await this.settings.setSettings();
    }

    // AWSログインからのメッセージの受信
    window.addEventListener('message', (event) => {
      // 目的のページがロードされた
      if (
        event.origin.indexOf('signin.aws.amazon.com') > 0 ||
        event.origin.indexOf('console.aws.amazon.com') > 0
      ) {
        // サインイン画面
        if (event.data === 'loaded' && event.origin.indexOf('signin.aws.amazon.com') > 0) {
          // 開いたwindowにメッセージを送信（ユーザー名とパスワード）
          this.awsWindow.postMessage({
            username: this.settings.username,
            password: this.settings.password
          }, event.origin);
        }
        // サインインが完了しダッシュボードが開いた
        if (event.data === 'loaded' && event.origin.indexOf('console.aws.amazon.com') > 0) {
          // Cloud9のリンクを同じwindowで開く
          this.OpenNamedWindow(this.cloud9_url);
        }
      }
    });

    // 「自動でCloud9を開く」ボタンの設置
    Util.queryAll<HTMLAnchorElement>('a[href*="aws.amazon.com/cloud9"]').forEach((e) => {
      const button: MCEElement = new MCEElement('button')
        .text('自動でCloud9を開く')
        .addClass('auto-open-the-cloud9')
        // ボタンの動作
        .addEventListener('click', (event: Event) => {
          this.cloud9_url = e.href;
          event.preventDefault();
          // window.name を指定して、リンクを開く
          this.awsWindow = this.OpenNamedWindow(aws.href);
          return false;
        });
        e.after(button.get());
    }, this);
  }

  static notify(title: string, body: string) {
    chrome.runtime.sendMessage({ type: 'notification', title, body });
  }
}
