var builder = require('botbuilder');
var request = require('request'),
    cheerio = require('cheerio');
var iconv = require('iconv-lite');
var charset = require('charset');
var url = "http://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp";
var msg;
var sel=1;
module.exports = [
    function (session) {
        msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("토익 시험 일정")
                    .text(str)
                    .buttons([builder.CardAction.openUrl(session, "http://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp", "더보기")
                    ])
            ])
        session.send(msg);
        builder.Prompts.confirm(session,"세부일정을 보시겠습니까?");
    },
    function (session, results) {
        if(results.response){
            builder.Prompts.choice(session,"원하시는 것을 선택해주세요.",["성적발표일","접수기간"], { listStyle: 3 });
        }
        else
            session.endDialog("OK");
    },
    function (session, results) {
        switch (results.response.index){
            case 0:
                sel = 1;
                break;
            case 1:
                sel = 2;
                break;
        }
        builder.Prompts.choice(session,"원하시는 날짜를 선택해주세요.",[num[0],num[1],num[2],num[3],num[4]], { listStyle: 3 });
    },
    function (session, results) {
        if (sel ==1){
            session.endDialog(announce[results.response.index]);
        }else if(sel == 2){
            session.endDialog(register[results.response.index]);
        }
    }
];

var str="";
var num = [];
var announce = [];
var register = [];
request({url: url, encoding: null}, function (err, resp, body) {
    const enc = charset(resp.headers, body);
    const i_result = iconv.decode(body, enc);
    var $ = cheerio.load(i_result);
    $('table.table_info_print').find('tr').each(function (index, item) {
        if(index>0){
            var tds = $(item).find('td.str');
            if(tds.eq(0).text().length != 0){
                str += "**\<"+tds.eq(0).text()+"\>**\n* " + tds.eq(1).text()
                +"\n------------------\n"};
            if(index<6){
                var tds2 = $(item).find('td');
                num[index-1] = tds2.eq(0).text().trim()+"("+tds2.eq(1).text().trim()+")";
                announce[index-1] = tds2.eq(2).text().trim();
                register[index-1] = tds2.eq(3).text();
            }
        };
    });
});
