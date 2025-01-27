export type CurriculumType = {
  name: string;
  url: string;
  visible: boolean;
}

type SettingsType = {
  interval: number;
  chime: boolean;
  notify: boolean;
  smartIfSimple: boolean;
  new_version: boolean;
  username: string;
  password: string;
  volume: number;
  course_list: any[];
  watchSlack: boolean;
  darkmode: boolean;
  diff: boolean;
  diffFromGit: boolean;
  curriculumSubMenu: boolean;
  curriculums: CurriculumType[];
}

export class Settings {
  // デフォルト
  public static DEFAULT: SettingsType = {
    interval:      30,
    chime:         false,
    notify:        false,
    smartIfSimple: false,
    new_version:   false,
    username:      '',
    password:      '',
    volume:        50,
    course_list:   [],
    watchSlack:    false,
    darkmode:      false,
    diff:          true,
    diffFromGit:   false,
    curriculumSubMenu: false,
    curriculums: [],
  };
  private props: SettingsType = Settings.DEFAULT;

  constructor() {
  }

  // 設定をクラスに読み込む
  async getSettings() {
    this.props = await chrome.storage.local.get(Settings.DEFAULT) as SettingsType;
  }

  async setSettings() {
    await chrome.storage.local.set(this.props);
  }

  // Getter
  get interval(): number {
    return this.props.interval;
  }
  get chime(): boolean {
    return this.props.chime;
  }
  get notify(): boolean {
    return this.props.notify;
  }
  get smartIfSimple(): boolean {
    return this.props.smartIfSimple;
  }
  get new_version(): boolean {
    return this.props.new_version;
  }
  get username(): string {
    return this.props.username;
  }
  get password(): string {
    return this.props.password;
  }
  get volume(): number {
    return this.props.volume;
  }
  get course_list(): any[] {
    return this.props.course_list;
  }
  get watchSlack(): boolean {
    return this.props.watchSlack;
  }
  get darkmode(): boolean {
    return this.props.darkmode;
  }
  get diff(): boolean {
    return this.props.diff;
  }
  get diffFromGit(): boolean {
    return this.props.diffFromGit;
  }
  get curriculumSubMenu(): boolean {
    return this.props.curriculumSubMenu;
  }
  get curriculums(): CurriculumType[] {
    return this.props.curriculums;
  }

  // Setter
  set interval(value: number) {
    this.props.interval = value;
  }
  set chime(value: boolean) {
    this.props.chime = value;
  }
  set notify(value: boolean) {
    this.props.notify = value;
  }
  set smartIfSimple(value: boolean) {
    this.props.smartIfSimple = value;
  }
  set new_version(value: boolean) {
    this.props.new_version = value;
  }
  set username(value: string) {
    this.props.username = value;
  }
  set password(value: string) {
    this.props.password = value;
  }
  set volume(value: number) {
    this.props.volume = value;
  }
  set course_list(value: any[]) {
    this.props.course_list = value;
  }
  set watchSlack(value: boolean) {
    this.props.watchSlack = value;
  }
  set darkmode(value: boolean) {
    this.props.darkmode = value;
  }
  set diff(value: boolean) {
    this.props.diff = value;
  }
  set diffFromGit(value: boolean) {
    this.props.diffFromGit = value;
  }
  set curriculumSubMenu(value: boolean) {
    this.props.curriculumSubMenu = value;
  }
  set curriculums(value: CurriculumType[]) {
    this.props.curriculums = value;
  }
}
