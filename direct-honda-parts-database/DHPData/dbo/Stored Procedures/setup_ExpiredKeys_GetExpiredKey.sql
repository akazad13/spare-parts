-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 15 Aug, 2020
-- Description:	SP for getting Expired claim key
-- =============================================
CREATE PROCEDURE  [dbo].[setup_ExpiredKeys_GetExpiredKey]
 @EXPIREDKEY AS VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [ExpiredKey], [LogoutTime]
	FROM dbo.[ExpiredKeys] WITH (NOLOCK)
	WHERE [ExpiredKey] = @EXPIREDKEY
END