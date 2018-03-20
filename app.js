require('dotenv-extended').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var restify = require('restify');
var builder = require('botbuilder');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// Setup Restify Server
var server= restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    function () {
        console.log('%s listening to %s', server.name, server.url);
    });

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'c1895866-aa5a-45a7-9d0f-854e642d3fd5',
    appPassword: 'xkngZXFN97!cugGXK092$({'
});
// Listen for messages from users
var _change = '번역하기';
var _date = '시험일정 보기';
var _answer = '시험 정답 확인';
var _preparation = '시험 준비물 확인';
var bot = new builder.UniversalBot(connector, function (session) {
        session.beginDialog('select');
});
bot.dialog('hello',[
    function (session) {
        builder.Prompts.text(session,"안녕하세요! 저는 Edubot입니다. 이름이 무엇입니까?");
    },
    function (session, results) {
         session.send(`${results.response}님 환영합니다!`);
         session.send("무엇이 필요하십니까?");
    }
]).triggerAction({ matches:( /(안녕|ㅎㅇ|하이|반갑|반가 )/i)});
bot.dialog('call',function (session) {
    session.send("네?");
    session.endDialog("무엇이 필요하십니까?");
}).triggerAction({ matches:( /(야|저기)/i)});
bot.dialog('select',[
    function (session) {
        builder.Prompts.choice(session, '보기 중 원하는 것을 선택해주세요.',[ _change,_answer,_preparation,_date]);
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('translate');
                break;
            case 1:
                session.beginDialog('answer');
                break;
            case 2:
                session.beginDialog('preparation');
                break;
            case 3:
                session.beginDialog('date');
                break;
        }
    }
]);
bot.dialog('help',[
    function (session) {
        builder.Prompts.confirm(session,"더 필요한것이 있습니까?");
    },function (session, results) {
        if (results.response){
            session.beginDialog('select');
        }else{
            session.send("OK, Bye~");
        }
    }
]);
bot.dialog('time',require('./toeicTime')).triggerAction({matches: (/(시간|진행)/i)});
bot.dialog('date', require('./toeicDate')).triggerAction({ matches:( /(시험일|일정|날짜)/i)});
bot.dialog('price',function (session) {
    session.endDialog("특별추가접수는 **48,900**원, 정기접수는 **44,500**원입니다.");
}).triggerAction({ matches:( /(응시료|가격|돈|비용)/i)});
bot.dialog('answer', require('./toeicAnswer')).triggerAction({matches: (/(답|정답|채점)/i)});
bot.dialog('preparation',function (session) {
    session.endDialog("**준비물**\n1. 규정신분증\n2. 연필(볼펜 및 사인펜은 사용 불가)\n3. 지우개\n4. " +
        "아날로그 손목시계(전자식 시계 불가)");
    session.beginDialog('help');
}).triggerAction({matches: (/(준비|챙겨|가져|갖고|신분증|펜|시계|연필)/i)});
bot.dialog('translate',[
    function (session) {
    builder.Prompts.choice(session,'원하시는 것을 선택해주세요',['english >> Korean','korean >> english'], { listStyle: 3 });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.send("문장을 입력해주세요.");
                session.beginDialog('toKotranslte');
                break;
            case 1:
                session.send("문장을 입력해주세요.");
                session.beginDialog('toEntranslte');
                break;
        }
    }
]).triggerAction({matches: (/(번역|해석)/i)});
bot.dialog('toKotranslte',require('./toKotranslate'));
bot.dialog('toEntranslte',require('./toEntranslate'));
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
