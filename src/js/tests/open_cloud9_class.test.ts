import { OpenCloud9 } from '../open_cloud9_class';
import { Settings } from '../settings';
import { Util } from '../util';

// モックの設定
jest.mock('../settings');

global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
  }
} as any;

describe('OpenCloud9', () => {
  let openCloud9: OpenCloud9;
  let mockWin: any;
  let mockSettings: jest.Mocked<Settings>;

  beforeEach(() => {
    mockWin = {
      open: jest.fn(),
      addEventListener: jest.fn(),
      postMessage: jest.fn(),
    };
    mockSettings = new Settings() as jest.Mocked<Settings>;
    (Settings as unknown as jest.Mock).mockReturnValue(mockSettings);

    openCloud9 = new OpenCloud9(mockWin);

    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('コンストラクターで何も指定しなくても各プロパティが正しく初期化されているか', () => {
      const tempOpenCloud9 = new OpenCloud9();
      expect(tempOpenCloud9['awsWindow']).toBe(global.window);
      expect(tempOpenCloud9['settings']).toBeInstanceOf(Settings);  
    });
  });

  describe('initialize', () => {
    test('Service Workerにメッセージを送信し、AWSリンクがない場合は早期リターンする', async () => {
      await openCloud9.initialize();
      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(mockSettings.getSettings).not.toHaveBeenCalled();
    });

    test('AWSリンクがある場合は設定を取得し、ボタンを設定する', async () => {
      document.body.innerHTML = '<div id="page-content-wrapper"><a href="https://signin.aws.amazon.com/console">AWS</a></div>';
      openCloud9['configureCloud9Button'] = jest.fn();
      await openCloud9.initialize();
      expect(mockSettings.getSettings).toHaveBeenCalledTimes(1);
      // ここではconfigureCloud9Buttonを呼び出しているかどうかだけチェック
      expect(openCloud9['configureCloud9Button']).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAWSLink', () => {
    test('AWSリンクが見つからない場合はfalseを返す', () => {
      expect(openCloud9['getAWSLink']()).toBe(false);
    });

    test('AWSリンクが見つかった場合はtrueを返し、URLを設定する', () => {
      document.body.innerHTML = '<div id="page-content-wrapper"><a href="https://signin.aws.amazon.com/console">AWS</a></div>';
      expect(openCloud9['getAWSLink']()).toBe(true);
      expect(openCloud9['awsUrl']).toBe('https://signin.aws.amazon.com/console');
    });
  });

  describe('openNamedWindow', () => {
    test('ウィンドウが開けない場合はエラーをスローする', () => {
      mockWin.open.mockReturnValue(null);
      expect(() => openCloud9['openNamedWindow']('http://example.com')).toThrow('AWSのWindowが開けませんでした');
    });

    test('ウィンドウが開けた場合はWindowProxyを返す', () => {
      const mockWindowProxy = {};
      mockWin.open.mockReturnValue(mockWindowProxy);
      expect(openCloud9['openNamedWindow']('http://example.com')).toBe(mockWindowProxy);
    });
  });

  describe('fetchUsernameAndPassword', () => {
    test('AWS情報要素がない場合は早期リターンする', async () => {
      await openCloud9['fetchUsernameAndPassword']();
      expect(mockSettings.setSettings).not.toHaveBeenCalled();
    });

    test('AWS情報要素があるが要素が足りない場合は早期リターン', async () => {
      document.body.innerHTML = '<a href="https://signin.aws.amazon.com/console">AWS</a>' + 
        '<div><div><b>Information</b><br>User: testuser</div></div>';
      await openCloud9['fetchUsernameAndPassword']();
      expect(mockSettings.setSettings).not.toHaveBeenCalled();
    });

    test('AWS情報要素がある場合はユーザー名とパスワードを設定し、設定を保存する', async () => {
      document.body.innerHTML = '<a href="https://signin.aws.amazon.com/console">AWS</a>' + 
        '<div><div><b>Information</b><br>User: testuser<br>Pass: testpassword</div></div>';
      await openCloud9['fetchUsernameAndPassword']();
      expect(mockSettings.username).toBe('testuser');
      expect(mockSettings.password).toBe('testpassword');
      expect(mockSettings.setSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendUsernameAndPassword', () => {
    test('AWSウィンドウにユーザー名とパスワードを送信する', () => {
      mockSettings.username = 'testuser';
      mockSettings.password = 'testpassword';
      const mockEvent = { origin: 'https://signin.aws.amazon.com' };
      openCloud9['awsWindow'] = mockWin;
      openCloud9['sendUsernameAndPassword'](mockEvent as MessageEvent);
      expect(mockWin.postMessage).toHaveBeenCalledWith(
        { username: 'testuser', password: 'testpassword' },
        mockEvent.origin
      );
    });
  });

  describe('handleMessageFromAWSWindow', () => {
    test('サインイン画面からのメッセージを処理する', () => {
      const mockEvent = { origin: 'https://signin.aws.amazon.com', data: 'loaded' };
      openCloud9['awsWindow'] = mockWin;
      openCloud9['handleMessageFromAWSWindow']('http://example.com');
      const messageHandler = mockWin.addEventListener.mock.calls[0][1];
      messageHandler(mockEvent);
      expect(mockWin.postMessage).toHaveBeenCalled();
    });

    test('ダッシュボード画面からのメッセージを処理する', () => {
      const mockEvent = { origin: 'https://console.aws.amazon.com', data: 'loaded' };
      const mockWindowProxy = {};
      mockWin.open.mockReturnValue(mockWindowProxy);
      openCloud9['awsWindow'] = mockWin;
      openCloud9['handleMessageFromAWSWindow']('http://example.com');
      const messageHandler = mockWin.addEventListener.mock.calls[0][1];
      messageHandler(mockEvent);
      expect(mockWin.open).toHaveBeenCalledWith('http://example.com', 'AWSOpenedFromMentorCheckEx');
    });
  });

  describe('installCloud9Button', () => {
    test('Cloud9ボタンをインストールする', () => {
      document.body.innerHTML = '<a href="https://aws.amazon.com/cloud9">Cloud9</a>';

      openCloud9['onOpenCloud9ButtonClicked'] = jest.fn();

      openCloud9['installCloud9Button']('http://example.com');
      const button = Util.query('a[href*="aws.amazon.com/cloud9"] + button', true);
      expect(button).not.toBeNull();
      button!.click();
      expect(openCloud9['onOpenCloud9ButtonClicked']).toHaveBeenCalled();
    });
  });

  describe('onOpenCloud9ButtonClicked', () => {
    test('「自動でCloud9を開く」ボタンの動作', () => {
      const element = document.createElement('a');
      element.href = 'https://aws.amazon.com/cloud9';
      mockWin.open.mockReturnValue({});
      openCloud9['onOpenCloud9ButtonClicked'](element, 'http://example.com');
      expect(openCloud9['cloud9Url']).toBe(element.href);
      expect(mockWin.open).toHaveBeenCalledWith('http://example.com', 'AWSOpenedFromMentorCheckEx');
    });
  });

  describe('configureCloud9Button', () => {
    beforeEach(() => {
      openCloud9['fetchUsernameAndPassword'] = jest.fn();
      openCloud9['handleMessageFromAWSWindow'] = jest.fn();
      openCloud9['installCloud9Button'] = jest.fn();
    });
    test('ユーザー名がない場合はユーザー名とパスワードを取得する', async () => {
      mockSettings.username = '';
      await openCloud9['configureCloud9Button']();
      expect(openCloud9['fetchUsernameAndPassword']).toHaveBeenCalled();
      expect(openCloud9['handleMessageFromAWSWindow']).toHaveBeenCalledWith(openCloud9['cloud9Url']);
      expect(openCloud9['installCloud9Button']).toHaveBeenCalledWith(openCloud9['awsUrl']);
    });

    test('ボタンのインストールとメッセージハンドラの登録を行う', async () => {
      mockSettings.username = 'testuser';
      await openCloud9['configureCloud9Button']();
      expect(openCloud9['handleMessageFromAWSWindow']).toHaveBeenCalledWith(openCloud9['cloud9Url']);
      expect(openCloud9['installCloud9Button']).toHaveBeenCalledWith(openCloud9['awsUrl']);
    });
  });
});
