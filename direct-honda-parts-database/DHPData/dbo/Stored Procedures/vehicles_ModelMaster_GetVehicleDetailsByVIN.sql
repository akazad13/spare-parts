-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for searching vehicle based on VIN number
-- =============================================

CREATE PROCEDURE [dbo].[vehicles_ModelMaster_GetVehicleDetailsByVIN]
	@VINSearchCode	VARCHAR(20)
AS
	SET NOCOUNT ON;

	BEGIN
	DECLARE @chrPrefix char(10)
	DECLARE @chrSuffix char(10)
	DECLARE @VINSearchLength int
	DECLARE @varMAX_SERIAL_HIGH varchar(7)
	DECLARE @ProductCount	INT
	DECLARE @YearCount	INT
	DECLARE	@DoorCount	INT
	DECLARE	@catalogCount	INT
	DECLARE @gradeCount	INT
	DECLARE @AreaCount	INT
	DECLARE @OriginCount	INT
	DECLARE @TransmissionCount INT
	DECLARE @ColorCount	INT
	DECLARE @ProductID varchar(7)
	DECLARE @YearID varchar(7)
	DECLARE @DoorID varchar(7)
	DECLARE	@intGradeID int
	DECLARE	@intCatalogID int
	DECLARE @intAreaID int
	DECLARE @OriginID int
	DECLARE @intTransmissionID int
	DECLARE @ColorLabelID int
	SET @varMAX_SERIAL_HIGH = 'ZZZZZZZ'
	--1) automotobile
	--2) products
	--3)doors tblDoor
	--4) years [Year]
	-- 5)grades Grade
	-- 6) tblArea
	--7) tblOrigin
	--8) CatalogUniqueIDs
	--9) tblTransmission
	--10)tblColorLabel
	--11) tblColorName
	--12) tblNarrowset_rel, tblNarrowSet_Section_rel
	DECLARE @tblPass1 TABLE
	(
		CatalogID int,  
		ProductID int, 
		DoorID int, 
		YearID int, 	
		GradeID int, 
		AreaID int, 
		OriginID int, 
		TransmissionID int, 
		ColorLabelID int, 
		ColorNameID int, 
		SerialTypeCode char(10), 
		SerialCheckCode char(10),  
		SerialHighCode char(20),  
		SerialLowCode char(20), 
		EngineTypeCode char(10), 
		EngineHighCode char(20), 
		EngineLowCode char(20), 
		TransmissiontypeCode char(10), 
		TransmissionHighCode char(20), 
		TransmissionLowCode char(20),  
		ModelNameText char(50)
	)

	SET @VINSearchCode = LTRIM(RTRIM(@VINSearchCode))

	SET @VINSearchLength = LEN(@VINSearchCode)
	--****************17 char VIN search*********************************
	IF (@VINSearchLength = 17)
	BEGIN
		print 17
		--1) 1st 8 chars = serialtypecode
		INSERT INTO @tblPass1(
			CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText
			)
		SELECT 
			CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText 
		FROM 
			ModelMaster WITH (NOLOCK)
		WHERE 
			ModelMaster.SerialTypeCode =   LEFT(@VINSearchCode, 8)
			--10th char in Vin Search = VinCode in [Year]
			--AND ModelMaster.YearID = (SELECT y.ID 
			AND ModelMaster.YearID IN (SELECT y.ID 
					FROM [Year] y  WITH (NOLOCK)
					WHERE 
					y.VinCode =  SUBSTRING(@VINSearchCode, 10, 1)
		   )
			--1,2 chars of SerialLowCode = 10,11 chars of Vin Serch string
			AND SUBSTRING(ModelMaster.SerialLowCode, 1, 2) = 
			     SUBSTRING(@VINSearchCode, 10, 2)
	
	
	END
	--****************12 char VIN search*********************************
	ELSE IF (@VINSearchLength = 12) 
	BEGIN
		print 12
			INSERT INTO 
			@tblPass1
			(CatalogID,  
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText
			)
		SELECT 
			CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText 
		FROM 
			ModelMaster WITH (NOLOCK)
		WHERE 
			ModelMaster.SerialTypeCode =   LEFT(@VINSearchCode, 5)
			--6 to 12 chars of Vin search string >= SerialLowCode
			AND ModelMaster.SerialLowCode <=
				SUBSTRING(@VINSearchCode, 6, 7)
			--6 to 12 <=  SerialHigh Code if present, if SerialHighCode not 
			--present less then 'ZZZZZZZZ'
			AND (
			     ( SUBSTRING(@VINSearchCode, 6, 7) <  SerialHighCode)
			     OR 
			     ( (LEN(SerialHighCode) <=0) AND (SUBSTRING(@VINSearchCode, 6, 7) < @varMAX_SERIAL_HIGH))
			     )
					
	
		--see if we have any items
		IF NOT EXISTS(SELECT * FROM @tblPass1)
		BEGIN 
			print 'did not find any using backup search'
				INSERT INTO 
			@tblPass1
			(CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText
			)
		SELECT 
			CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText 
		FROM 
			ModelMaster WITH (NOLOCK)
		WHERE 
			ModelMaster.SerialTypeCode =   LEFT(@VINSearchCode, 8)
			--10th char in Vin Search = VinCode in [Year]
			--AND ModelMaster.YearID = (SELECT y.ID 
			AND ModelMaster.YearID IN (SELECT y.ID 
					FROM [Year] y  WITH (NOLOCK)
					WHERE 
					y.VinCode =  SUBSTRING(@VINSearchCode, 10, 1)
			)
			--1,2 chars of SerialLowCode = 10,11 chars of Vin Serch string
			AND SUBSTRING(ModelMaster.SerialLowCode, 1, 2) = 
				SUBSTRING(@VINSearchCode, 10, 2)
		END
	
	END
	--****************10 char VIN search*********************************
	ELSE IF (@VINSearchLength = 10) 
	BEGIN
		print 10
	
		INSERT INTO 
			@tblPass1
			(CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText
			)
		SELECT 
			CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText 
		FROM 
			ModelMaster WITH (NOLOCK)
		WHERE 
			LTRIM(RTRIM(ModelMaster.SerialTypeCode)) =   LEFT(@VINSearchCode, 2)
			--3 to 10 chars of Vin search string >= SerialLowCode
			AND ModelMaster.SerialLowCode <=
				SUBSTRING(@VINSearchCode, 3, 8)
			--if SerialHighCode is not null, Vin Search( 3 to 10) < SerialHighCode
			--else if is null,  Vin Search( 3 to 10) < 'ZZZZZZZ' 
	
			AND (
			     ( SUBSTRING(@VINSearchCode, 3, 7) <  SerialHighCode)
			     OR 
			     ( (LEN(SerialHighCode) <=0) AND (SUBSTRING(@VINSearchCode, 3, 7) < @varMAX_SERIAL_HIGH))
			     )
	
		--see if we have any items
		IF NOT EXISTS(SELECT * FROM @tblPass1)
		BEGIN 
			print 'did not find any using backup search'
	
			INSERT INTO 
			@tblPass1
			(CatalogID, 
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText
			)
		SELECT 
			CatalogID,  
			ProductID, 
			DoorID, 
			YearID, 	
			GradeID, 
			AreaID, 
			OriginID, 
			TransmissionID, 
			ColorLabelID, 
			ColorNameID, 
			SerialTypeCode, 
			SerialCheckCode,  
			SerialHighCode,  
			SerialLowCode, 
			EngineTypeCode, 
			EngineHighCode, 
			EngineLowCode, 
			TransmissiontypeCode, 
			TransmissionHighCode, 
			TransmissionLowCode,  
			ModelNameText 
		FROM 
			ModelMaster WITH (NOLOCK)
		WHERE 
			LTRIM(RTRIM(ModelMaster.SerialTypeCode)) =   LEFT(@VINSearchCode, 8) 
			--10th char in Vin Search = VinCode in [Year]
			--AND ModelMaster.YearID = (SELECT y.ID 
			AND ModelMaster.YearID IN (SELECT y.ID 
					FROM [Year] y  WITH (NOLOCK)
					WHERE 
					y.VinCode =  SUBSTRING(@VINSearchCode, 10, 1)
			)
		END
	END
	-------------------PERFORM SELECTS----------------------------------------------
	--1) automotobile
	--2) products
	--3)doors tblDoor
	--4) years [Year]
	-- 5)grades Grade
	-- 6) tblArea
	--7) tblOrigin
	--8) CatalogUniqueIDs
	--9) tblTransmission
	--10)tblColorLabel
	--11) tblColorName
	--12) tblNarrowset_rel, tblNarrowSet_Section_rel
	--1) --Select ProductCategories that pertain to choices
	SELECT DISTINCT  
		0 AS ID, 
		'AUTOMOBILE'  AS Description

	--2 
	--Select Products
	SELECT DISTINCT 
		a.ID AS ProductId, 
		a.Description  As ProductDescr
	FROM 
		Product	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1		b 
	ON 
		b.ProductID	=	a.ID
	ORDER BY 
		a.Description ,a.ID




	SELECT @ProductCount = @@ROWCOUNT
	IF @ProductCount = 1
	BEGIN
		SELECT DISTINCT
			@ProductID = a.ID
		FROM 
			Product	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1		b 
		ON 
			b.ProductID	=	a.ID
	END
	ELSE
	BEGIN
		SELECT @ProductID = 0
	END
	--Select Doors
	SELECT DISTINCT  
		a.ID As DoorId, 
		a.Description As DoorDescr
	FROM 
		Door	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1		b 
	ON 
		b.DoorID	=	a.ID 		
	ORDER BY 
		a.Description , a.ID
	SELECT @DoorCount = @@ROWCOUNT		
	IF @DoorCount = 1
	BEGIN
		SELECT DISTINCT
			@DoorID = a.ID
		FROM 
			Door	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1		b 
		ON 
			b.DoorID	=	a.ID 
	END
	ELSE
	BEGIN
		SELECT @DoorID = 0
	END
	--Select Years
	SELECT DISTINCT  
		a.ID As YearId, 
		a.Description As YearDescr
	FROM 
		[Year]	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1		b 
	ON 
		b.YearID	=	a.ID 
	ORDER BY 
		a.Description DESC , a.ID
	SELECT @YearCount = @@ROWCOUNT		
	IF @YearCount = 1
	BEGIN
		SELECT DISTINCT
			@YearID = a.ID
		FROM 
			[Year]	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1		b 
		ON 
			b.YearID	=	a.ID 

	END
	ELSE
	BEGIN
		SELECT @YearID = 0
	END
	IF @ProductCount = 1
	BEGIN
		--Select Products
		SELECT DISTINCT 
			a.ID As ProductId, 
			a.Description As ProductDescr
		FROM 
			Product	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster		b  WITH (NOLOCK)
		ON 
			b.ProductID	=	a.ID
		AND
			((DoorID		= @DoorID) OR (@DoorID = 0))
		AND
			((YearID		= @YearID) OR (@YearID = 0))
		ORDER BY 
			a.Description , a.ID
	END
	IF @DoorCount = 1
	BEGIN
		--Select Doors
		SELECT DISTINCT  
			a.ID As DoorId, 
			a.Description As DoorDescr
		FROM 
			Door	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster		b  WITH (NOLOCK)
		ON 
			b.DoorID	=	a.ID 
		WHERE 
			((ProductID		= @ProductID) OR (@ProductID = 0))
		AND
			((YearID		= @YearID) OR (@YearID = 0))
		ORDER BY 
			a.Description , a.ID
	END
	IF @YearCount = 1
	BEGIN
		--Select Years
		SELECT DISTINCT  
			a.ID As YearId, 
			a.Description As YearDescr 
		FROM 
			[Year]	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster		b  WITH (NOLOCK)
		ON 
			b.YearID	=	a.ID 
		WHERE
			((ProductID		= @ProductID) OR (@ProductID = 0))
		AND
			((DoorID		= @DoorID) OR (@DoorID = 0))
		ORDER BY 
			a.Description DESC , a.ID
	END
	--Select CatalogUniqueIDs
	SELECT DISTINCT  
		a.CatalogID
	FROM 
		@tblPass1	a
	SELECT @CatalogCount = @@ROWCOUNT
	--Select Grades
	SELECT DISTINCT  
		a.ID As GradeId, 
		a.Description As GradeDescr
	FROM 
		Grade	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1		b 
	ON 
		b.GradeID	=	a.ID 
	ORDER BY 
		a.Description , a.ID
	SELECT @GradeCount = @@ROWCOUNT		
	IF @GradeCount = 1
	BEGIN
		--Select Grades
		SELECT DISTINCT
			@intGradeID = a.ID
		FROM 
			Grade	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1		b 
		ON 
			b.GradeID	=	a.ID 
	END
	ELSE
	BEGIN
		SELECT @intGradeID = 0
	END
	--Select Areas
	SELECT DISTINCT  
		a.ID As AreaId, 
		a.Description As AreaDescr
	FROM 
		Area	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1	b 
	ON 
		b.AreaID	=	a.ID 	
	ORDER BY
		a.Description , a.ID
	SELECT @AreaCount = @@ROWCOUNT		
	IF @AreaCount = 1
	BEGIN
		--Select Areas
		SELECT DISTINCT  
			@intAreaID = a.ID
		FROM 
			Area	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1	b 
		ON 
			b.AreaID	=	a.ID 
	END
	ELSE
	BEGIN
		SELECT @intAreaID = 0
	END
	--Select Origins
	SELECT DISTINCT  
		a.ID As OriginId, 
		a.Description As OriginDescr
	FROM 
		Origin	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1	b 
	ON 
		b.OriginID	=	a.ID 	
	ORDER BY 
		a.Description 		, a.ID
	SELECT @OriginCount = @@ROWCOUNT		
	IF @OriginCount = 1
	BEGIN
		--Select Origins
		SELECT DISTINCT  
			@OriginID = a.ID
		FROM 
			Origin	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1	b 
		ON 
			b.OriginID	=	a.ID 		
	END
	ELSE
	BEGIN
		SELECT @OriginID = 0
	END
	--Select Transmissions
	SELECT DISTINCT  
		a.ID As TransmissionId, 
		a.Description  As TransmissionDescr
	FROM 
		Transmission	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1	b 
	ON 
		b.TransmissionID	=	a.ID 
	ORDER BY 
		a.Description 	, a.ID	
	SELECT @TransmissionCount = @@ROWCOUNT		
	IF @TransmissionCount = 1
	BEGIN
		--Select Transmissions
		SELECT DISTINCT  
			@intTransmissionID = a.ID
		FROM 
			Transmission	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1	b 
		ON 
			b.TransmissionID	=	a.ID 	
	END
	ELSE
	BEGIN
		SELECT @intTransmissionID = 0
	END
	--Select ColorLabel
	SELECT DISTINCT  
		a.ID As ColorLabelID, 
		a.Description As ColorLabelDescr
	FROM 
		ColorLabel	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1	b 
	ON 
		b.ColorLabelID	=	a.ID 
	ORDER BY
		a.Description , a.ID
	SELECT @ColorCount = @@ROWCOUNT		
	IF @ColorCount = 1
	BEGIN
		--Select ColorLabel
		SELECT DISTINCT  
			@ColorLabelID = a.ID
		FROM 
			ColorLabel	a  WITH (NOLOCK)
		INNER JOIN 
			@tblPass1	b 
		ON 
			b.ColorLabelID	=	a.ID 
	END
	ELSE
	BEGIN
		SELECT @ColorLabelID = 0
	END
	--Select ColorName
	SELECT DISTINCT  
		a.ID As ColorNameId, 
		a.Description As ColorNameDescr
	FROM 
		ColorName	a  WITH (NOLOCK)
	INNER JOIN 
		@tblPass1	b 
	ON 
		b.ColorNameID	=	a.ID 
	ORDER BY 
		a.Description , a.ID
	IF @GradeCount = 1
	BEGIN
		--Select Grade List
		SELECT DISTINCT  
			a.ID As GradeId, 
			a.Description As GradeDescr
		FROM 
			Grade	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster	b  WITH (NOLOCK)
		ON 
			b.GradeID	=	a.ID
		WHERE 
			b.ProductID		= @ProductID  
		AND 
			b.DoorID		= @DoorID
		AND 
			b.YearID		= @YearID 
		AND 
			((b.AreaID		= @intAreaID) OR @intAreaID=0)
		AND 
			((b.OriginID		= @OriginID) OR @OriginID=0)
		AND 
			((b.TransmissionID	= @intTransmissionID) OR @intTransmissionID=0)
		AND 
			((b.ColorLabelID	= @ColorLabelID) OR @ColorLabelID=0)
		ORDER BY 
			a.Description 	, a.ID	
	END
	IF @AreaCount = 1
	BEGIN
		--Select Area List
		SELECT DISTINCT  
			a.ID As AreaId, 
			a.Description As AreaDescr
		FROM 
			Area		a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster	b  WITH (NOLOCK)
		ON 
			b.AreaID	=	a.ID
		WHERE 
			b.ProductID		= @ProductID  
		AND 
			b.DoorID		= @DoorID
		AND 
			b.YearID		= @YearID 
		AND 
			((b.GradeID		= @intGradeID) OR @intGradeID=0)
		AND 
			((b.OriginID		= @OriginID) OR @OriginID=0)
		AND 
			((b.TransmissionID	= @intTransmissionID) OR @intTransmissionID=0)
		AND 
			((b.ColorLabelID	= @ColorLabelID) OR @ColorLabelID=0)
		ORDER BY 
			a.Description 		, a.ID
	END
	IF @OriginCount = 1
	BEGIN
		--Select Origin List
		SELECT DISTINCT  
			a.ID As OriginId, 
			a.Description  As OriginDescr
		FROM 
			Origin	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster	b  WITH (NOLOCK)
		ON 
			b.OriginID	=	a.ID
		WHERE 
			b.ProductID		= @ProductID  
		AND 
			b.DoorID		= @DoorID
		AND 
			b.YearID		= @YearID 
		AND 
			((b.GradeID		= @intGradeID) OR @intGradeID=0)
		AND 
			((b.AreaID		= @intAreaID) OR @intAreaID=0)
		AND 
			((b.TransmissionID	= @intTransmissionID) OR @intTransmissionID=0)
		AND 
			((b.ColorLabelID	= @ColorLabelID) OR @ColorLabelID=0)
		ORDER BY 
			a.Description , a.ID
	END
	IF @TransmissionCount = 1
	BEGIN
		--Select Transmission List
		SELECT DISTINCT  
			a.ID As TransmissionID, 
			a.Description  As TransmissionDescr
		FROM 
			Transmission	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster	b  WITH (NOLOCK)
		ON 
			b.TransmissionID	= a.ID
		WHERE 
			b.ProductID		= @ProductID  
		AND 
			b.DoorID		= @DoorID
		AND 
			b.YearID		= @YearID 
		AND 
			((b.GradeID		= @intGradeID) OR @intGradeID=0)
		AND 
			((b.AreaID		= @intAreaID) OR @intAreaID=0)
		AND 
			((b.OriginID		= @OriginID) OR @OriginID=0)
		AND 
			((b.ColorLabelID	= @ColorLabelID) OR @ColorLabelID=0)
		ORDER BY 
			a.Description 		, a.ID
	END
	IF @ColorCount = 1
	BEGIN
		--Select Color Label List
		SELECT DISTINCT  
			a.ID As ColorLabelId, 
			a.Description As ColorLabelDescr
		FROM 
			ColorLabel	a  WITH (NOLOCK)
		INNER JOIN 
			ModelMaster	b  WITH (NOLOCK)
		ON 
			b.ColorLabelID	=	a.ID 
		WHERE 
			b.ProductID		= @ProductID  
		AND 
			b.DoorID		= @DoorID
		AND 
			b.YearID		= @YearID 
		AND 
			((b.GradeID		= @intGradeID) OR @intGradeID=0)
		AND 
			((b.AreaID		= @intAreaID) OR @intAreaID=0)
		AND 
			((b.OriginID		= @OriginID) OR @OriginID=0)
		AND 
			((b.TransmissionID	= @intTransmissionID) OR @intTransmissionID=0)
		ORDER BY 
			a.Description 		, a.ID
	END
	SELECT DISTINCT
		c.ID As SectionId,
		c.Description As Sectiondescr
	FROM
		Narrowset_rel		a WITH (NOLOCK)
	INNER JOIN
		NarrowSet_Section_rel	b WITH (NOLOCK)
	ON
		b.CatalogID			= a.CatalogID
	AND
		b.NarrowSetSequenceID		= a.NarrowSetSequenceID
	INNER JOIN
		Section			c WITH (NOLOCK)
	ON
		c.ID				= b.SectionID	
	INNER JOIN
		@tblPass1			d
	ON
		d.CatalogID			= a.CatalogID
	AND
		d.ProductID			= a.ProductID
	AND
		d.DoorID			= a.DoorID
	AND
		d.YearID			= a.YearID
	AND
		d.GradeID			= a.GradeID
	AND
		d.AreaID			= a.AreaID
	AND
		d.OriginID			= a.OriginID
	AND
		d.TransmissionID		= a.TransmissionID		
					
	ORDER BY 
		c.ID
	select
		*
	from
		@tblPass1
END
RETURN 0
