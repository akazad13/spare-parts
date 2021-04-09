-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 01 Sep, 2020
-- Description:	SP for deleting user address
-- =============================================
CREATE PROCEDURE  [dbo].[dashboard_User_DeleteUser]
 @USERID AS BIGINT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	BEGIN
		DELETE FROM [User] Where [Id] = @USERID;
		DELETE FROM [UserAddress] Where [UserId] = @USERID;
	END

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	SELECT 0 AS ReturnCode;
	RETURN (0);
	
	on_error:  
		SELECT 'Problem deleting the user.' AS ReturnMsg, -1 AS ReturnCode
		RETURN(-1)

END