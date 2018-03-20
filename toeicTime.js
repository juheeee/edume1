var builder = require('botbuilder');

module.exports = [
    function (session) {
        builder.Prompts.confirm(session,"시험진행 일정을 보시겠습니까?");
    },
    function (session, results) {
        if(results.response){
            builder.Prompts.choice(session,"시험 시간을 선택해주세요.",["오전","오후"], { listStyle: 3 });
        }
        else
            session.endDialog("OK");
    },
    function (session, results) {
        switch (results.response.index){
            case 0:
                session.endDialog("9:30~9:45    - 오리엔테이션<br/>9:45~9:50    - 휴식시간" +
                    "<br/>9:50~10:05   - 신분증 확인<br/>10:05~10:10  - 문제지 배부" +
                    "<br/>10:10~10:55(45분) - LC<br/>10:55~12:10(75분) - RC 및 2차 신분확인");
                break;
            case 1:
                session.endDialog("14:30~14:45     - 오리엔테이션<br/>14:45~14:50     - 휴식시간" +
                    "<br/>14:50~15:05   - 신분증 확인<br/>15:05~15:10  - 문제지 배부" +
                    "<br/>15:10~15:55(45분) - LC<br/>15:55~17:10(75분) - RC 및 2차 신분확인");
                break;
        }
        session.beginDialog('help');
    }];