-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 8 Aug, 2020
-- Description:	SP for update user
-- =============================================
CREATE PROCEDURE  [dbo].[setup_User_UpdateUser]
 @ID AS BIGINT, 
 @EMAIL AS VARCHAR(100),
 @FIRSTNAME AS VARCHAR(50),
 @LASTNAME AS VARCHAR(50),
 @PASSWORD AS VARCHAR(255),
 @ROLE AS VARCHAR(10),
 @VERIFICATIONCODE AS VARCHAR(255),
 @VERIFIED AS BIT,
 @PASSWORDRESETTOKEN AS VARCHAR(255),
 @PASSWORDRESETEXPIRES AS DATETIME,
 @PHONE AS VARCHAR(50),
 @ACTIVE AS BIT,
 @MODIFIEDBY AS BIGINT,
 @MODIFIEDON AS DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	UPDATE dbo.[User]
	SET
		[FirstName] = @FIRSTNAME,
		[LastName] = @LASTNAME,
		[Password] = @PASSWORD,
		[Role] = @ROLE,
		[VerificationCode] = @VERIFICATIONCODE,
		[Verified] = @VERIFIED,
		[PasswordResetToken] = @PASSWORDRESETTOKEN,
		[PasswordResetExpires] = @PASSWORDRESETEXPIRES,
		[Phone] = @PHONE,
		[Active] = @ACTIVE,
		[ModifiedBy] = @MODIFIEDBY,
		[ModifiedOn] = @MODIFIEDON
	WHERE Id = @ID and Email = @EMAIL

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	RETURN(0);

	on_error:
      RETURN(0);
END