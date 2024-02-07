-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 17 Aug, 2020
-- Description:	SP for deleting user address
-- =============================================
CREATE PROCEDURE  [dbo].[setup_UserAddress_DeleteUserAddress]
 @ID AS BIGINT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	IF EXISTS(SELECT Id FROM [UserAddress] WITH (NOLOCK) WHERE id = @ID AND AddressType = 1)
	BEGIN
		SELECT 'You can not delete your default address.' AS ReturnMsg, -1 AS ReturnCode
		RETURN (0);
	END
	ELSE
	BEGIN
		DELETE FROM [UserAddress] Where [Id] = @ID;	
	END

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	SELECT 0 AS ReturnCode;
	RETURN (0);
	
	on_error:  
		SELECT 'Problem deleting the address.' AS ReturnMsg, -1 AS ReturnCode
		RETURN(-1)

END