-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 15 Aug, 2020
-- Description:	SP for getting user based on Id
-- =============================================
CREATE PROCEDURE  [dbo].[setup_User_GetUserById]
 @ID AS BIGINT
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
	WHERE Id = @ID OR @ID = -1
END