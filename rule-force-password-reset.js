// force password reset upon next login
function (user, context, callback) {
  
  // init
  let denyAuth = false;
  let forcePasswordReset = false;
  let forcePasswordResetTimestamp = 0;
  
  // read app_metadata
  try {
    // this rule expects the following two attributes set in the app_metadata
    // if they are not present defaults set above are assumed
    // for forcing a user to reset their password before authenticating to the application
    // set user.app_metadata.force_password_reset = true
    // set user.app_metadata.force_password_reset_timestamp = current time
    forcePasswordReset = user.app_metadata.force_password_reset;
    forcePasswordResetTimestamp = user.app_metadata.force_password_reset_timestamp;
  } catch (e) {
    // force_password_reset was undefined in app_metadata
    // leave it at default values
    console.log(e);
  }
  
  if(forcePasswordReset) {
    // read last password reset system timestamp
    const lastPasswordReset = user.last_password_reset;
  
    // flag was set after password was last reset
    if(new Date(forcePasswordResetTimestamp) > new Date(lastPasswordReset)) {
      // force user to reset password
      console.log("deny authentication");
      denyAuth = true;
    } else {
      // password was reset after flag was set
      // reset the flag
      console.log("allow authentication and reset flag");
      user.app_metadata.force_password_reset = false;
      user.app_metadata.force_password_reset_timestamp = 0;
      // persist the app_metadata update
      auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
        .then(function(){
          callback(null, user, context);
        }).catch(function(err){
          callback(err);
        });
    }
  
    if(denyAuth) {
      // force user to reset password
      // ideally after receiving this callback, 
      // the application should redirect to /v2/logout, 
      // so that user can try to reset password on ULP
      return callback(new UnauthorizedError('reset-password-required'));
    }
  }
  
  // proceed to next rule or application callback
  callback(null, user, context);
}