const CopyWebpackPlugin = require("copy-webpack-plugin");
const { Compiler } = require("webpack");

module.exports = [
  // ファイルをトランスパイル・パックする設定
  {
    mode: process.env.NODE_ENV || "development",
    entry: {
      "background":             __dirname + "/src/background.ts",
      "js/appointments":        __dirname + "/src/js/appointments.ts",
      "js/curriculums":         __dirname + "/src/js/curriculums.ts",
      "js/mentoring_calendar":  __dirname + "/src/js/mentoring_calendar.ts",
      "js/open_cloud9":         __dirname + "/src/js/open_cloud9.ts",
      "js/open_gdrive":         __dirname + "/src/js/open_gdrive.ts",
      "js/review_check":        __dirname + "/src/js/review_check.ts",
      "js/review_diff":         __dirname + "/src/js/review_diff.ts",
      "js/review_memo":         __dirname + "/src/js/review_memo.ts",
      "js/schedule":            __dirname + "/src/js/schedule.ts",
      "js/slack_report_page":   __dirname + "/src/js/slack_report_page.ts",
      "js/user_progress":       __dirname + "/src/js/user_progress.ts",
      "js/work_shifts":         __dirname + "/src/js/work_shifts.ts",
    },
    output: {
      path: __dirname + "/mentor_check_ex",
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    // publicディレクトリに配置する静的リソースやmanifest.json等を移送する
    plugins: [
      new CopyWebpackPlugin({ patterns: [{ from: "public", to: "../mentor_check_ex/" }] })
    ],
  },
  // 他のスクリプトから利用するmoduleを作る設定
  {
    mode: process.env.NODE_ENV || "development",
    entry: {
      "js/curriculum_codes":    __dirname + "/src/js/curriculum_codes.ts",
    },
    output: {
      path: __dirname + "/mentor_check_ex",
      filename: "[name].js",
      libraryTarget: "module",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
          },
          exclude: /node_modules/,
        },
      ],
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: [".ts"],
    },
  }
];
