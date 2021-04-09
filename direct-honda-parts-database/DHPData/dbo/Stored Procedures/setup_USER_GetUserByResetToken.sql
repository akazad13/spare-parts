-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 14 Aug, 2020
-- Description:	SP for getting user based on reset token
-- =============================================
CREATE PROCEDURE  [dbo].[setup_User_GetUserByResetToken]
 @PASSWORDRESETTOKEN AS VARCHAR(100)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
	   [Id]
	  ,[FirstName]
      ,[LastName]
      ,[Email]
      ,[Password]
      ,[Role]
      ,[VerificationCode]
      ,[Verified]
      ,[PasswordResetToken]
      ,[PasswordResetExpires]
      ,[Phone]
	  ,[Active]
	  ,[CreatedBy]
	  ,[CreatedOn]
	  ,[ModifiedBy]
	  ,[ModifiedOn]
	FROM [dbo].[User] WITH (NOLOCK)
	WHERE PasswordResetToken = @PASSWORDRESETTOKEN
END