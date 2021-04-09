CREATE FUNCTION [dbo].[fn_User_GetUserFullNameById]
(
	@ID BIGINT
)
RETURNS VARCHAR(102)
AS
BEGIN
	RETURN(SELECT FirstName + ' ' + LastName FROM dbo.[User] WHERE Id = @ID)
END
