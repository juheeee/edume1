var builder = require('botbuilder');
var request = require('request');
var express    = require('express');
var app = express();
var bodyParser = require('body-parser');

var client_id = 'GfrGgfvBoMye9AHmIrkC';
var client_secret = 'LsoHrs0bJl';
var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var options;

module.exports = [function (session) {
    var str = session.message.text;
    options = {
        url: api_url,
        form: {'source': 'en', 'target': 'ko', 'text': str},
        headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
    };
    request.post(options, function (error, response, body) {
        //번역이 성공하였다면.
        if (!error && response.statusCode == 200) {
            //json 파싱
            var objBody = JSON.parse(response.body);
            //번역된 메시지
            session.send(objBody.message.result.translatedText);
        }else {
            //네이버에서 메시지 에러 발생
            console.log('error = ' + response.statusCode);
        }
    });
}];