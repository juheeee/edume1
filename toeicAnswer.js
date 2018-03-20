var builder = require('botbuilder');
var request = require('request'),
    cheerio = require('cheerio');
var url2 = "http://www.hackers.co.kr/?mod=fullservice_marking&answer_ex_date=";
var fir = "", sec = "";
var firstLc="", firstRc="", secLc="", secRc="";

module.exports = [
    function (session) {
        builder.Prompts.choice(session, '원하시는 날짜를 선택해주세요.', [fir,sec], { listStyle: 3 })
    },function (session, results) {
        var option = results.response.index;
        switch (option) {
            case 0:
                session.endDialog("**LC**:\n" + firstLc + "\n----------------------\n" + "**RC**:\n" + firstRc);
                break;
            case 1:
                session.endDialog("**LC**:\n" + secLc + "\n-----------------------\n" + "**RC**:\n" + secRc);
                break;
        }
        session.beginDialog('help');
    }];
request({url: url2}, function (err, resp, body) {//시험답 가져오기
    var $ = cheerio.load(body);
    $('div.answer_select_wrap').find('select').each(function (index, item) {
        var ops = $(item).find('option');
        fir += ops.eq(1).text().trim();
        sec += ops.eq(2).text().trim();
    })
    var $ = cheerio.load(body);
    $('th:contains(Part1)').parents('tbody').find('tr').each(function (index, item) {
        if(index>0){
            var tds = $(item).find('td.correct');
            if( (index%5) ==0){
                firstLc += tds.text().trim()+ "/\n";
            }else{
                firstLc += tds.text().trim();
            }
        }
    })
    $('th:contains(Part5)').parents('tbody').find('tr').each(function (index, item) {
        if(index>0){
            var tds = $(item).find('td.correct');
            if( (index%5) ==0){
                firstRc += tds.text().trim()+ "/\n";
            }else{
                firstRc += tds.text().trim();
            }
        }
    })
    request({url: url2+sec}, function (err, resp, body) {
        var $ = cheerio.load(body);
        $('th:contains(Part1)').parents('tbody').find('tr').each(function (index, item) {
            if (index > 0) {
                var tds = $(item).find('td.correct');
                if ((index % 5) == 0) {
                    secLc += tds.text().trim() + "/\n";
                } else {
                    secLc += tds.text().trim();
                }
            }
        })
        $('th:contains(Part5)').parents('tbody').find('tr').each(function (index, item) {
            if (index > 0) {
                var tds = $(item).find('td.correct');
                if ((index % 5) == 0) {
                    secRc += tds.text().trim() + "/\n";
                } else {
                    secRc += tds.text().trim();
                }
            }
        })
    });
});