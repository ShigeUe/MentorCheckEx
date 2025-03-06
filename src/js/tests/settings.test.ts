import { Settings, CurriculumType } from '../settings';

// chrome APIをモック化
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
} as any;

describe('Settings', () => {
  let settings: Settings;
  let mockGet: jest.Mock;
  let mockSet: jest.Mock;

  beforeEach(() => {
    settings = new Settings();
    mockGet = chrome.storage.local.get as jest.Mock;
    mockSet = chrome.storage.local.set as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('デフォルト値で初期化されていること', () => {
    expect(settings.interval).toBe(30);
    expect(settings.chime).toBe(false);
    expect(settings.notify).toBe(false);
    expect(settings.smartIfSimple).toBe(false);
    expect(settings.new_version).toBe(false);
    expect(settings.username).toBe('');
    expect(settings.password).toBe('');
    expect(settings.volume).toBe(50);
    expect(settings.course_list).toEqual([]);
    expect(settings.watchSlack).toBe(false);
    expect(settings.darkmode).toBe(false);
    expect(settings.diff).toBe(true);
    expect(settings.diffFromGit).toBe(false);
    expect(settings.curriculumSubMenu).toBe(false);
    expect(settings.curriculums).toEqual([]);
  });

  test('ストレージから設定を読み込めること', async () => {
    const mockSettings = {
      interval: 60,
      chime: true,
      notify: true,
      smartIfSimple: true,
      new_version: true,
      username: 'testuser',
      password: 'testpassword',
      volume: 75,
      course_list: ['course1', 'course2'],
      watchSlack: true,
      darkmode: true,
      diff: false,
      diffFromGit: true,
      curriculumSubMenu: true,
      curriculums: [{ name: 'curriculum1', url: 'url1', visible: true }],
    };
    mockGet.mockResolvedValue(mockSettings);

    await settings.getSettings();

    expect(mockGet).toHaveBeenCalledWith(Settings.DEFAULT);
    expect(settings.interval).toBe(60);
    expect(settings.chime).toBe(true);
    expect(settings.notify).toBe(true);
    expect(settings.smartIfSimple).toBe(true);
    expect(settings.new_version).toBe(true);
    expect(settings.username).toBe('testuser');
    expect(settings.password).toBe('testpassword');
    expect(settings.volume).toBe(75);
    expect(settings.course_list).toEqual(['course1', 'course2']);
    expect(settings.watchSlack).toBe(true);
    expect(settings.darkmode).toBe(true);
    expect(settings.diff).toBe(false);
    expect(settings.diffFromGit).toBe(true);
    expect(settings.curriculumSubMenu).toBe(true);
    expect(settings.curriculums).toEqual([{ name: 'curriculum1', url: 'url1', visible: true }]);
  });

  test('ストレージに設定を保存できること', async () => {
    settings.interval = 10;
    settings.chime = true;
    settings.notify = true;
    settings.smartIfSimple = true;
    settings.new_version = true;
    settings.username = "hogehoge";
    settings.password = "fugafuga";
    settings.volume = 90;
    settings.course_list = ["courseA","courseB"];
    settings.watchSlack = true;
    settings.darkmode = true;
    settings.diff = false;
    settings.diffFromGit = true;
    settings.curriculumSubMenu = true;
    settings.curriculums = [{name: 'hoge', url:'https://www.hoge.com', visible: false}]

    await settings.setSettings();

    expect(mockSet).toHaveBeenCalledWith({
      interval: 10,
      chime: true,
      notify: true,
      smartIfSimple: true,
      new_version: true,
      username: "hogehoge",
      password: "fugafuga",
      volume: 90,
      course_list: ["courseA","courseB"],
      watchSlack: true,
      darkmode: true,
      diff: false,
      diffFromGit: true,
      curriculumSubMenu: true,
      curriculums: [{name: 'hoge', url:'https://www.hoge.com', visible: false}]
    });
  });

  test('Setterで設定を更新できること', () => {
    settings.interval = 60;
    expect(settings.interval).toBe(60);

    settings.chime = true;
    expect(settings.chime).toBe(true);

    settings.notify = true;
    expect(settings.notify).toBe(true);

    settings.smartIfSimple = true;
    expect(settings.smartIfSimple).toBe(true);

    settings.new_version = true;
    expect(settings.new_version).toBe(true);

    settings.username = "testuser";
    expect(settings.username).toBe("testuser");

    settings.password = "testpassword";
    expect(settings.password).toBe("testpassword");

    settings.volume = 70;
    expect(settings.volume).toBe(70);

    settings.course_list = ["a", "b"];
    expect(settings.course_list).toEqual(["a","b"]);

    settings.watchSlack = true;
    expect(settings.watchSlack).toBe(true);

    settings.darkmode = true;
    expect(settings.darkmode).toBe(true);

    settings.diff = false;
    expect(settings.diff).toBe(false);

    settings.diffFromGit = true;
    expect(settings.diffFromGit).toBe(true);

    settings.curriculumSubMenu = true;
    expect(settings.curriculumSubMenu).toBe(true);

    const newCurriculums: CurriculumType[] = [{ name: 'new', url:'http://new.com', visible: true}];
    settings.curriculums = newCurriculums;
    expect(settings.curriculums).toEqual(newCurriculums);
  });
});
