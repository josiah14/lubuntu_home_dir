var GoogleOAuth2 = {
	scope: "https://www.google.com/reader/api",

	request_auth_url: "https://accounts.google.com/o/oauth2/auth?scope={scope}&redirect_uri={callback}&client_id={client_id}&response_type=code",
	token_url: 'https://accounts.google.com/o/oauth2/token',
	
	approveURL: 'https://accounts.google.com/o/oauth2/approval',
	
	requestAuthURL: function() {
		return GoogleOAuth2.request_auth_url
		.replace("{scope}", GoogleOAuth2.scope)
		.replace("{client_id}", GoogleOAuth2.client_id)
		.replace("{callback}", GoogleOAuth2.redirect_uri);
	},
	
	tokenURL: function() {
		return GoogleOAuth2.token_url;
	},
	
	newTokenPostData: function() {
		return {
			code: GoogleOAuth2.code,
			client_id: GoogleOAuth2.client_id,
			client_secret: GoogleOAuth2.client_secret,
			redirect_uri: GoogleOAuth2.redirect_uri,
			grant_type: "authorization_code"
		};
	},
	
	refreshTokenPostData: function() {
		return {
			refresh_token: GoogleOAuth2.refresh_token,
			client_id: GoogleOAuth2.client_id,
			client_secret: GoogleOAuth2.client_secret,
			grant_type: "refresh_token"
		};
	},
	
	verifyCode: function(callback) {
		var request = new Request({
			url: GoogleOAuth2.tokenURL(),
			method: 'POST',
			onComplete: GoogleOAuth2.updateTokenComplete.withCallback(callback)
		});
		
		request.send({post: GoogleOAuth2.newTokenPostData()});
	},
	
	refreshToken: function(callback) {
		var request = new Request({
			url: GoogleOAuth2.tokenURL(),
			method: 'POST',
			onComplete: GoogleOAuth2.updateTokenComplete.withCallback(callback)
		});
		
		request.send({post: GoogleOAuth2.refreshTokenPostData()});
	},
	
	updateTokenComplete: function(status, text, xml, callback) {
		var data = tryToParseJSON(text);

		if ( ! data) {
			GoogleOAuth2.tokenError = true;
			return fireCallback(callback);
		}
		
		if ( data.refresh_token )
			GoogleOAuth2.refresh_token = data.refresh_token;
		GoogleOAuth2.access_token = data.access_token;
		GoogleOAuth2.token = data;
		GoogleOAuth2.tokenError = false;
		
		fireCallback(callback);
	},
	
	checkToken: function(callback) {
		if ( ! GoogleOAuth2.refresh_token )
			return callback(false);
		
		GoogleOAuth2.refreshToken(function() {
			callback(!! GoogleOAuth2.access_token);
		});
	},
	
	client_id: "638422542259-vj0ujd0qhn7qs6sv7uv72om8nectr3ef.apps.googleusercontent.com",
	client_secret: "fe6b538Y03xcFpToi1X_Ce1D",
	
	redirect_uri: "urn:ietf:wg:oauth:2.0:oob"
};
