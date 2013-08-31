(function() {
    var graph = 'https://graph.facebook.com/',
        app_id = false,
        scope = '';

    var FBNb = {
        _uid: '',
        init: function(id, perms) {
            app_id = id;
            scope = perms || '';
        },
        getUser: function(fn) {
            /* Get user ID immediately */
            FBNb.api('/me', function(res) {
                if(res && res.id) {
                    localStorage._uid = res.id;
                    FBNb._uid = res.id;
                    fn && fn(res);
                }
            });
        },
        getMissingPermissions: function(fn) {
            var self = this, missing = [];
            FBNb.api('me/permissions', function(res) {
                if(res && !res.error && res.data && res.data[0]) {
                    var perms = scope.replace(/\s/g, '').split(','), i = 0;
                    for(;i< perms.length;i++) {
                        if(!(perms[i] in res.data[0])) {
                            if(!(perms[i] in {'friends_checkins': 1, 'user_checkins': 1, 'friends_status': 1, 'user_status':1, 'offline_access': 1})) {
                                missing.push(perms[i]);
                            }
                        }
                    }
                    fn && fn(missing);
                }
            });
        },
        getAccessToken: function() {
            if (localStorage.fbToken == undefined) return false;
            var d = new Date();
            var actualTime = d.getTime();
            var timeLoged = (actualTime - localStorage.timeLogin) / 1000;
            console.log('Time Loged: ' + timeLoged/60 + ' minutes');
            console.log('Time to expire: ' + (localStorage.fbExpires)/60 + ' minutes');
            if (timeLoged > localStorage.fbExpires)
                return false;
            else
                return localStorage.fbToken;
        },
        setAccessToken: function(token) {
            if(token === false) {
                localStorage.removeItem('fbToken');
            } else {
                localStorage.fbToken = token;
            }
        },
        getUserID: function() {
            return localStorage._uid || FBNb._uid;
        },
        login: function() {
           // var url = graph + "oauth/authorize?client_id=" + app_id + "&redirect_uri=http://www.localesparamusicos.com/zocalo.html&type=user_agent&display=page&scope=" + scope;
            sendMessageToBackground({loginFace: "login"});
            var url = "https://www.facebook.com/dialog/oauth?client_id=339270982866129&response_type=token&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=email";
			window.open(url, 'Facebook Login', "width=900,height=400,left=200,top=150,scrollbars=no");
        },
        inviteFriends: function(message) {
            message = message.substring(0,60);
            //var url = "https://www.facebook.com/dialog/apprequests?app_id=339270982866129&message=" + encodeURIComponent(message) + "&display=popup&redirect_uri=http://localhost/zocalo/api/sendRequestFb.php?conversationId=" + idConversation;
            var url = "https://www.facebook.com/dialog/apprequests?app_id=339270982866129&message=" + encodeURIComponent(message) + "&display=popup&redirect_uri=http://localhost/noteboardapp/api/sendRequestFb.php?conversationId=";
            window.open(url, 'Invite Friends', "width=800,height=500,left=100,top=100,scrollbars=no");
        },
        api: function(path /*, type [post/get], params obj, callback fn */) {
            var args = Array.prototype.slice.call(arguments, 1),
                fn = false,
                params = {},
                method = 'get';

            /* Parse arguments to their appropriate position */
            for(var i in args) {
                switch(typeof args[i]) {
                    case 'function':
                        fn = args[i];
                    break;
                    case 'object':
                        params = args[i];
                    break;
                    case 'string':
                        method = args[i].toLowerCase();
                    break;
                }
            }

            /* Make sure there is a path component */
            if(!path && !params.batch) {
                return fn && fn(false);
            }

            /* Use the passed method i.e. get, post, delete */
            params.method = method;
            params.access_token = this.getAccessToken();

            /* Make call */
            $.get(graph + path, params, function(res) {
                /* If there is an auth error, don't continue and make them login */
                if(res && res.error && res.error.type && (res.error.message == 'Invalid OAuth access token.' || res.error.message.indexOf('Error validating access token') > -1)) {
                    FBNb.login();
                    return;
                }
                if(typeof fn == 'function') {
                    fn(res);
                }
            }, 'json');
        },
        objectFromURL: function(url) {
            /* Get rid of non-facebook URLs */
            if(url.indexOf('facebook.com') == -1) {
                return url;
            }
        },
        setFbObject: function(response){
            FBNb.fbObject = response;
        },
        feed: function(link,message){
            //message = message.substring(60);
            var url = "https://www.facebook.com/dialog/feed?app_id=339270982866129&link=" + encodeURIComponent(link) + "&name=" + encodeURIComponent(document.title) + "&display=popup&description=" + encodeURIComponent(message) + "&redirect_uri=http://www.zocalosquare.com/api/sendRequestFb.php";
            //var url = "https://www.facebook.com/dialog/feed?app_id=339270982866129&link=" + encodeURIComponent(link) + "&name=" + encodeURIComponent(document.title) + "&display=popup&description=" + encodeURIComponent(message) + "&redirect_uri=http://localhost/zocalo/api/sendRequestFb.php";
            window.open(url, 'Publish', "width=600,height=500,left=200,top=100,scrollbars=no");
        }
    };
    window.FBNb = FBNb;
})();


function loginFacebook()
{

            //chrome.extension.sendMessage({loginFace: "login"});
            FBNb.init('339270982866129', 'read_friendlists');

            if(!FBNb.getAccessToken()) {
                FBNb.login();
            }
            else getFBDataLogin();

}
function getFBDataLogin()
{
    FBNb.api('me?fields=id,name,friends,email', function(response) {
        //sendLogin(response.name,'',true,response.id,response.email);
    });
}

// https://www.facebook.com/dialog/apprequests?message=9lessons%20Programming%20Blog%20Topics%20focused%20on%20Web%20Programming.&api_key=110166500203&app_id=110166500203&locale=en_US&sdk=joey&display=popup&frictionless=false&next=http%3A%2F%2Fstatic.ak.facebook.com%2Fconnect%2Fxd_arbiter.php%3Fversion%3D18%23cb%3Df1af7ea058%26origin%3Dhttp%253A%252F%252Fwww.9lessons.info%252Ff365c14d2%26domain%3Dwww.9lessons.info%26relation%3Dopener%26frame%3Dfde8d9148%26result%3D%2522xxRESULTTOKENxx%2522
//http://localhost/zocalo/api/acceptInviteFb.php?request=443295142405751&to%5B0%5D=100005056596475#_=_



//https://www.facebook.com/connect/login_success.html#access_token=CAAD5AF44W…vgRakXqPg6cVjSI3PJblxyRHLRjWzNueWCQrwbSOtcehvQ2m4wxLHaxUZD&expires_in=4780