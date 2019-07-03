Simple rule to force password reset upon next login

To force a user to reset password upon next login, set the following attributes in user's app_metadata

`force_password_reset` = `true`

`force_password_reset_timestamp` = <current_timestamp>

ISO 8601 Extended format: `YYYY-MM-DDTHH:mm:ss:sssZ`

Rule will reset those values after their purpose is met.