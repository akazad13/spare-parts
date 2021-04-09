-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 31 Aug, 2020
-- Description:	SP for update dashboard user profile
-- =============================================
CREATE PROCEDURE  [dbo].[dashboard_User_UpdateUserProfile]
 @ID AS BIGINT, 
 @FIRSTNAME AS VARCHAR(50),
 @LASTNAME AS VARCHAR(50),
 @EMAIL AS VARCHAR(100),
 @ROLE AS VARCHAR(10),
 @PHONE AS VARCHAR(50),
 @ACTIVE AS BIT,
 @THEME AS VARCHAR(10),
 @COMPANYNAME AS VARCHAR(100),
 @COUNTRY AS VARCHAR(50),
 @ADDRESS AS VARCHAR(255),
 @CITY AS VARCHAR(50),
 @STATE AS VARCHAR(50),
 @POSTCODE AS INT,
 @MODIFIEDBY AS BIGINT,
 @MODIFIEDON AS DATETIME
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	UPDATE dbo.[User]
	SET
		[FirstName] = @FIRSTNAME,
		[LastName] = @LASTNAME,
		[ROLE] = @ROLE,
		[Phone] = @PHONE,
		[Active] = @ACTIVE,
		[Theme] = @THEME,
		[ModifiedBy] = @MODIFIEDBY,
		[ModifiedOn] = @MODIFIEDON
	WHERE [Id] = @ID and [Email] = @EMAIL

	IF(EXISTS(SELECT Id FROM dbo.[UserAddress] WHERE [UserId] = @ID))
	BEGIN
		UPDATE dbo.[UserAddress]
		SET
			[FirstName] = @FIRSTNAME,
			[LastName] = @LASTNAME,
			[CompanyName] = @COMPANYNAME,
			[Country] = @COUNTRY,
			[Address] = @ADDRESS,
			[City] = @CITY,
			[State] = @STATE,
			[Postcode] = @POSTCODE,
			[Email] = @EMAIL,
			[Phone] = @PHONE,
			[ModifiedBy] = @MODIFIEDBY,
			[ModifiedOn] = @MODIFIEDON
		WHERE [UserId] = @ID;
	END
	ELSE
	BEGIN
		INSERT INTO dbo.[UserAddress] 
			(
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
				[UserId]
			)
			VALUES
			(
				@FIRSTNAME, 
				@LASTNAME, 
				@COMPANYNAME,
				@COUNTRY,
				@ADDRESS,
				@CITY,
				@STATE,
				@POSTCODE,
				@EMAIL,
				@PHONE,
				1,
				@MODIFIEDBY,
				@MODIFIEDON,
				@ID
			);
	END
	

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	SELECT 0 AS ReturnCode;
	RETURN 0;

	on_error:  
		SELECT 'Problem performing the operation' AS ReturnMsg, -1 AS ReturnCode
		RETURN(0)
END