-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 17 Aug, 2020
-- Description:	SP for getting user address
-- =============================================
CREATE PROCEDURE  [dbo].[setup_UserAddress_GetUserAddresses]
 @USERID AS BIGINT,
 @ID AS BIGINT,
 @ADDRESSTYPE AS TINYINT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
	   [Id],
	   [FirstName],
	   [LastName],
	   [CompanyName], 
	   [Country],
	   [Address],
	   [City],
	   [State],
	   [Postcode],
	   [Email],
	   [Phone],
	   [AddressType],
	   [CreatedBy],
	   [CreatedOn],
	   [ModifiedBy],
	   [ModifiedOn],
	   [UserId]
	FROM [dbo].[UserAddress] WITH (NOLOCK)
	WHERE ([Id] = @ID OR @ID = -1)
	AND [UserId] = @USERID
	AND ([AddressType] = @ADDRESSTYPE OR @ADDRESSTYPE = 0);
END