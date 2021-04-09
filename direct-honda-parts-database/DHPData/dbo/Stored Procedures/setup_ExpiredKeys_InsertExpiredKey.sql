-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 15 Aug, 2020
-- Description:	SP for Inserting Expired claim key
-- =============================================
CREATE PROCEDURE  [dbo].[setup_ExpiredKeys_InsertExpiredKey]
 @EXPIREDKEY AS VARCHAR(255),
 @LOGOUTTIME AS DATETIME
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO dbo.[ExpiredKeys] 
	(
		[ExpiredKey], 
		[LogoutTime]
	)
	VALUES
	(
		@EXPIREDKEY, 
		@LOGOUTTIME
	);
	RETURN 0;
END