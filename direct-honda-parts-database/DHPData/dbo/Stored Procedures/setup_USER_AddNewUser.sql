-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 5 Aug, 2020
-- Description:	SP for getting user based on email
-- =============================================
-- 2 Sept, 2020    Kalam      updated sp to return user id
------------------------------------------------
CREATE PROCEDURE  [dbo].[setup_User_AddNewUser]
 @EMAIL AS VARCHAR(100),
 @FIRSTNAME AS VARCHAR(50),
 @LASTNAME AS VARCHAR(50),
 @PHONE AS VARCHAR(50),
 @PASSWORD AS VARCHAR(255),
 @ROLE AS VARCHAR(10),
 @VERIFICATIONCODE AS VARCHAR(255),
 @VERIFIED AS BIT,
 @ACTIVE AS BIT,
 @CREATEDBY AS BIGINT,
 @CREATEDON AS DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	INSERT INTO dbo.[User] 
	(
		[Email], 
		[FirstName], 
		[LastName],
		[Phone],
		[Password], 
		[Role], 
		[VerificationCode], 
		[Verified],
		[Active],
		[CreatedBy],
		[CreatedOn]
	)
	VALUES
	(
		@EMAIL, 
		@FIRSTNAME, 
		@LASTNAME,
		@PHONE,
		@PASSWORD,
		@ROLE, 
		@VERIFICATIONCODE,
		@VERIFIED,
		@ACTIVE,
		@CREATEDBY,
		@CREATEDON
	);

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	SELECT [Id]
	FROM dbo.[User] WITH(NOLOCK)
	WHERE [Email] = @EMAIL

	RETURN 0;

	on_error:  
		SELECT 'Problem performing the operation' AS ReturnMsg, -1 AS Id
		RETURN(-1)
END