-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 17 Aug, 2020
-- Description:	SP for getting add/update user address
-- =============================================
CREATE PROCEDURE  [dbo].[setup_UserAddress_AddOrUpdateAddress]
 @ID AS BIGINT,
 @FIRSTNAME AS VARCHAR(50),
 @LASTNAME AS VARCHAR(50),
 @COMPANYNAME AS VARCHAR(100),
 @COUNTRY AS VARCHAR(50),
 @ADDRESS AS VARCHAR(255),
 @CITY AS VARCHAR(50),
 @STATE AS VARCHAR(50),
 @POSTCODE AS INT,
 @EMAIL AS VARCHAR(100),
 @PHONE AS VARCHAR(50),
 @ADDRESSTYPE AS TINYINT,
 @CREATEDBY AS BIGINT,
 @CREATEDON AS DATETIME,
 @MODIFIEDBY AS BIGINT,
 @MODIFIEDON AS DATETIME,
 @USERID AS BIGINT,
 @ISADDOPERATION AS BIT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ErrNo INT;

	IF @ISADDOPERATION = 1
	BEGIN

		IF (SELECT COUNT(Id) FROM [UserAddress] WITH (NOLOCK) WHERE [UserId] = @USERID) >= 3
		BEGIN
			SELECT 'You can not add more than 3 addresses.' AS ReturnMsg, -1 AS ReturnCode;
			RETURN (0);
		END

		ELSE IF EXISTS(SELECT Id FROM [UserAddress] WITH (NOLOCK) WHERE [UserId] = @USERID AND AddressType = @ADDRESSTYPE AND @ADDRESSTYPE = 1)
		BEGIN
			SELECT 'You can not add multiple default address.' AS ReturnMsg, -1 AS ReturnCode;
			RETURN (0);
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
				@ADDRESSTYPE,
				@CREATEDBY,
				@CREATEDON,
				@USERID
			);
		END
	END
	ELSE
	BEGIN
		
		IF @ADDRESSTYPE = 1
		-- Set default address to normal
		BEGIN
			UPDATE dbo.[UserAddress]
		SET
			[AddressType] = 3,
			[ModifiedBy] = @MODIFIEDBY,
			[ModifiedOn] = @MODIFIEDON
		WHERE UserId = @USERID AND ADDRESSTYPE = 1
		END

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
			[AddressType] = @ADDRESSTYPE,
			[ModifiedBy] = @MODIFIEDBY,
			[ModifiedOn] = @MODIFIEDON
		WHERE Id = @ID;
	END

	SET @ErrNo = @@ERROR
      IF @ErrNo <> 0 GOTO on_error

	SELECT 0 AS ReturnCode;
	RETURN 0;

	on_error:  
		SELECT 'Problem performing the operation' AS ReturnMsg, -1 AS ReturnCode
		RETURN(-1)
END