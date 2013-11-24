// Requests for everything, keeps track if new session tokens are needed

Google.Request = Class.extend({	
	initialize: function(params) {
		this.params = toOptions(params, {
			method: 'GET',
			type: 'json',
			params: {get: {}, post: {}},
			token: false,
			onComplete: function(response, status, googRequest) {}
		});
		
		this.params.params.post = this.params.params.post || {};
		this.params.params.get = this.params.params.get || {};
		
		this.url = this.makeURL(this.params.url);
		this.timesTried = 0;
	},
	
	start: function() {
		this.params.params.get.ck = Date.now();
		this.params.params.get.client = Google.client;
		
		this.timesTried++;
		
		if ( this.params.token ) {
			if ( this.timesTried > 2 )
				return this.requestError();
		
			this.getToken(function(token) {
				if ( ! token )
					return this.requestError();
				
				this.params.params[this.params.method == 'GET' ? 'get' : 'post'].T = token;
				this.sendRequest();
			});
		} else
			this.sendRequest();
		
		return this;
	},
		
	sendRequest: function() {
		this.request = new Request({
			url: this.url,
			method: this.params.method,
			onComplete: this.requestComplete,
			onError: this.requestError,
			arrayedParamsToMultipleKey: true
		});
		
		this.request.addHeader('Authorization', 'Bearer ' + GoogleOAuth2.access_token);
		
		this.request.send(this.params.params);
	},
	
	getToken: function(callback) {
		if ( Google.Request.currentToken )
			return callback.call(this, Google.Request.currentToken);
		
		this.tokenRequest = new Request({
			url: this.makeURL(Google.tokenURL),
			method: 'GET',
			
			onComplete: function(status, text, xml) {
				if ( status == 200 ) {
					Google.Request.currentToken = text;
					return callback.call(this, text);
				}
				
				callback.call(this, false);
			}.bind(this),
			
			onError: function() {
				callback.call(this, false);
			}.bind(this)
		});
		
		this.tokenRequest.addHeader('Authorization', 'Bearer ' + GoogleOAuth2.access_token);
		
		this.tokenRequest.send();
	},
	
	requestComplete: function(status, text, xml) {
		// Bad token and should have token? Request new token
		if ( this.request.getHeader('X-Reader-Google-Bad-Token') && this.params.token ) {
			Google.Request.currentToken = false;
			this.start();
			return;
		}
				
		var response = text;
		
		if ( this.params.type === 'json' ) {
			try {
				response = JSON.parse(response);
			} catch (e) {
				response = false;
			}
		} else if ( this.params.type === 'xml' ) {
			response = xml;
		}
		this.params.onComplete(response, status, this);
	},
	
	requestError: function() {
		this.params.onComplete(false, 0, this);
	},
	
	makeURL: function(url) {
		if ( !! url.match(/^http:\/\/|https:\/\//) )
			return url;
		return Google.path + url;
	}
});
