import { MCEElement }  from "./mceelement";
import { Settings } from "./settings";
import { Util } from "./util";

export class OpenCloud9
{
  private cloud9Url = '';
  private awsUrl = '';
  private awsWindow: Window;
  private settings: Settings;
  private win: Window;

  constructor(win: Window = window) {
    this.win = win;
    this.awsWindow = win;
    this.settings = new Settings();
  }

  public async initialize(): Promise<void> {
    // 空のメッセージを送ることで、Service Workerを起こしてバージョンアップの確認をさせる
    chrome.runtime.sendMessage({});
    // AWSのリンクが無かったらボタンを設置しない
    if (!this.getAWSLink()) {
      return;
    }
    await this.settings.getSettings();
    await this.configureCloud9Button();
  }

  private getAWSLink(): boolean {
    const element = Util.query<HTMLAnchorElement>('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]', true);
    if (!element) {
      return false;
    }
    this.awsUrl = element.href;
    return true;
  }

  // 共通のウィンドウ名で開く
  private openNamedWindow(url: string): WindowProxy {
    const w: WindowProxy | null = this.win.open(url, 'AWSOpenedFromMentorCheckEx');
    if (!w) {
      throw Error('AWSのWindowが開けませんでした');
    }
    else {
      return w;
    }
  }

  // 画面からusernameとpasswordを取得する
  private async fetchUsernameAndPassword(): Promise<void> {
    // AWSのリンクの直後のDIVの中にユーザー名とパスワードが入っている
    const awsInfoElement = Util.query<HTMLDivElement>('a[href*="signin.aws.amazon.com/console"] + div > div', true);
    if (awsInfoElement) {
      const awsInfoArray = awsInfoElement.innerHTML.split('<br>');
      if (awsInfoArray.length < 3) {
        return;
      }
      this.settings.username = awsInfoArray[1].split(' ')[1];
      this.settings.password = awsInfoArray[2].split(' ')[1];
      // 設定に保存する
      await this.settings.setSettings();
    }
  }

  // AWSのサインイン画面にユーザー名とパスワードを送信
  private sendUsernameAndPassword(event: MessageEvent): void {
    this.awsWindow.postMessage(
      {
        username: this.settings.username,
        password: this.settings.password
      },
      event.origin
    );
  }

  private handleMessageFromAWSWindow(link: string): void {
    // AWSログインからのメッセージの受信
    this.win.addEventListener('message', (event: MessageEvent) => {
      // サインイン画面
      if (event.origin.includes('signin.aws.amazon.com') && event.data === 'loaded') {
        this.sendUsernameAndPassword(event);
      }
      // ダッシュボード画面
      if (event.origin.includes('console.aws.amazon.com') && event.data === 'loaded') {
        // Cloud9のリンクを同じwindowで開く
        this.openNamedWindow(link);
      }
    });
  }

  private installCloud9Button(link: string): void {
    Util.queryAll<HTMLAnchorElement>('a[href*="aws.amazon.com/cloud9"]').forEach((e) => {
      const button: MCEElement = new MCEElement('button')
        .text('自動でCloud9を開く')
        .addClass('auto-open-the-cloud9')
        // ボタンの動作
        .addEventListener('click', (event: Event) => {
          event.preventDefault();
          this.onOpenCloud9ButtonClicked(e, link);
          return false;
        });
      e.after(button.get());
    }, this);
  }

  private onOpenCloud9ButtonClicked(element: HTMLAnchorElement, link: string) {
    this.cloud9Url = element.href;
    // window.name を指定して、リンクを開く
    this.awsWindow = this.openNamedWindow(link);
  }

  // 「自動でCloud9を開く」ボタンを設置するための設定をする
  private async configureCloud9Button(): Promise<void> {
    // 設定に username が無ければ、画面から取得する
    if (!this.settings.username) {
      await this.fetchUsernameAndPassword();
    }
    // AWSのwindowからのメッセージのよって処理を行う
    this.handleMessageFromAWSWindow(this.cloud9Url);

    // 「自動でCloud9を開く」ボタンの設置
    this.installCloud9Button(this.awsUrl);
  }
}
