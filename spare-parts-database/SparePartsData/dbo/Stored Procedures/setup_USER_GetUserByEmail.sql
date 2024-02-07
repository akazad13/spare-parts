-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 5 Aug, 2020
-- Description:	SP for getting user based on email
-- =============================================
CREATE PROCEDURE  [dbo].[setup_User_GetUserByEmail]
 @EMAIL AS VARCHAR(100)
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
	  ,[Theme]
	  ,[CreatedBy]
	  ,[CreatedOn]
	  ,[ModifiedBy]
	  ,[ModifiedOn]
	FROM [dbo].[User] WITH (NOLOCK)
	WHERE Email = @EMAIL
END