'use strict';

const MES2RC = new MentorCheckEx();

// 課題のID取得
const reviewHeading = MES2RC.query('#page-content-wrapper .container-fluid .row .row.add-margin-top-30 .col-sm-8 h3');

if (reviewHeading) {
    const reviewNum = reviewHeading.innerText.match(/\d+/);
    const reviewId = 'edit_report_' + reviewNum;

    // レビュー中（フォームのIDが存在する）ならリンクを追加
    if (MES2RC.queryId(reviewId) != null) {

        // リンクの作成
        const skipLink = MCEElement.create('a').prop({ href: '#' + reviewId }).addClass('mce-skiplink').text('評価コメントまでスキップする');

        // リンクの差し込み
        MES2RC.query('#page-content-wrapper .container-fluid .row .col-lg-12 .row.add-margin-top-30 .col-sm-8').prepend(skipLink.get());

    }
}
