-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 30 Aug, 2020
-- Description:	SP for getting user profile based on userid
-- =============================================
CREATE PROCEDURE  [dbo].[dashboard_User_GetUserProfile]
 @UserId AS BIGINT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
	   U.[Id]
	  ,U.[FirstName]
      ,U.[LastName]
      ,U.[Email]
      ,U.[Role]
      ,U.[Phone]
	  ,U.[Active]
	  ,U.[Theme]
	  ,U.[CreatedBy]
	  ,U.[CreatedOn]
	  ,U.[ModifiedBy]
	  ,U.[ModifiedOn]
	  ,UA.[CompanyName]
	  ,UA.[Country]
	  ,UA.[Address]
	  ,UA.[City]
	  ,UA.[State]
	  ,UA.[Postcode]
	  ,CreatorName = CASE WHEN U.[CreatedBy] = 0 THEN (U.[FirstName] + ' ' + U.[LastName]) ELSE dbo.[fn_User_GetUserFullNameById] (U.[CreatedBy]) END
	  ,ModifierName = CASE WHEN U.[CreatedBy] = 0 THEN (U.[FirstName] + ' ' + U.[LastName]) ELSE dbo.[fn_User_GetUserFullNameById] (U.[ModifiedBy]) END
	FROM [dbo].[User] U WITH (NOLOCK)
	LEFT JOIN [dbo].[UserAddress] UA WITH (NOLOCK)
	ON U.id = UA.UserId
	WHERE (U.[Id] = @UserId OR @UserId = -1)
	AND (ISNULL(UA.AddressType, 0) <> 2 AND ISNULL(UA.AddressType, 0) <> 3)
END