import { MCEElement }  from "./mceelement";
import { Settings } from "./settings";
import { Util } from "./util";

class MentorCheckEx
{
  public cloud9Url = '#';
  public awsWindow: Window = window;
  public settings: Settings;

  constructor() {
    // 空のメッセージを送ることで、Service Workerを起こしてバージョンアップの確認をさせる
    chrome.runtime.sendMessage({});
    this.settings = new Settings();
  }

  // 共通のウィンドウ名で開く
  private openNamedWindow(url: string): WindowProxy {
    return window.open(url, 'AWSOpenedFromMentorCheckEx')!;
  }

  // 画面からusernameとpasswordを取得する
  private fetchUsernameAndPassword() {
    // AWSのリンクの直後のDIVの中にユーザー名とパスワードが入っている
    const aws_info_ele = Util.query<HTMLDivElement>('a[href*="signin.aws.amazon.com/console"] + div');
    if (aws_info_ele) {
      const aws_info = aws_info_ele.innerText.split('\n');
      this.settings.username = aws_info[1].split(' ')[1];
      this.settings.password = aws_info[2].split(' ')[1];
    }
  }
  // 「自動でCloud9を開く」ボタンを設置するための設定をする
  public async configureCloud9Button() {
    // AWSのリンクが無ければ終了する
    const awsLink = Util.query<HTMLAnchorElement>('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]', true);
    if (awsLink === null) {
      return;
    }
    // 設定に username が無ければ、画面から取得する
    if (!('username' in this.settings) || !this.settings.username) {
      this.fetchUsernameAndPassword();
      await this.settings.setSettings();
    }

    // AWSログインからのメッセージの受信
    window.addEventListener('message', (event) => {
      // 目的のページがロードされた
      if (event.origin.includes('signin.aws.amazon.com') || event.origin.includes('console.aws.amazon.com')) {
        // サインイン画面
        if (event.data === 'loaded' && event.origin.includes('signin.aws.amazon.com')) {
          // 開いたwindowにメッセージを送信（ユーザー名とパスワード）
          this.awsWindow.postMessage({
            username: this.settings.username,
            password: this.settings.password
          }, event.origin);
        }
        // サインインが完了しダッシュボードが開いた
        if (event.data === 'loaded' && event.origin.includes('console.aws.amazon.com')) {
          // Cloud9のリンクを同じwindowで開く
          this.openNamedWindow(this.cloud9Url);
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
          this.cloud9Url = e.href;
          event.preventDefault();
          // window.name を指定して、リンクを開く
          this.awsWindow = this.openNamedWindow(awsLink.href);
          return false;
        });
        e.after(button.get());
    }, this);
  }
}

(async () => {
  const m = new MentorCheckEx;
  // 設定を取得
  await m.settings.getSettings();

  // 「自動でCloud9を開く」ボタンを設置
  m.configureCloud9Button();
})();

