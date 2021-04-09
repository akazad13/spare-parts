-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 13 Sept, 2020
-- Description:	SP for migrating data
-- =============================================
CREATE PROCEDURE [dbo].[MigrateTablesData]
AS
	SET NOCOUNT ON;

	-- Product table(
	DELETE FROM Product;
	INSERT INTO Product([ID], [Description], [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblProduct
	WHERE [LanguageID] = 0


	-- Year table
	DELETE FROM Year;
	INSERT INTO Year([ID], [Description], [VinCode], [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), LTRIM(RTRIM([VinCode])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblYear
	WHERE [LanguageID] = 0

	-- Door table
	DELETE FROM Door;
	INSERT INTO Door([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblDoor
	WHERE [LanguageID] = 0

	-- Grade table
	DELETE FROM Grade;
	INSERT INTO Grade([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblGrade
	WHERE [LanguageID] = 0

	-- Area table
	DELETE FROM Area;
	INSERT INTO Area([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblArea
	WHERE [LanguageID] = 0

	-- Area table
	DELETE FROM Transmission;
	INSERT INTO Transmission([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblTransmission
	WHERE [LanguageID] = 0

	-- ModelMaster table
	DELETE FROM ModelMaster;
	INSERT INTO ModelMaster(
		[CatalogID],
		[ProductID],
		[DoorID],
		[YearID],
		[GradeID],
		[AreaID],
		[OriginID],
		[TransmissionID],
		[ColorLabelID],
		[ColorNameID],
		[SerialTypeCode],
		[SerialCheckCode],
		[SerialHighCode],
		[SerialLowCode],
		[EngineTypeCode],
		[EngineHighCode],
		[EngineLowCode],
		[TransmissiontypeCode],
		[TransmissionHighCode],
		[TransmissionLowCode],
		[ModelNameText],
		[HSCode]
	)
	SELECT 
		[CatalogID],
		[ProductID],
		[DoorID],
		[YearID],
		[GradeID],
		[AreaID],
		[OriginID],
		[TransmissionID],
		[ColorLabelID],
		[ColorNameID],
		LTRIM(RTRIM([SerialTypeCode])),
		LTRIM(RTRIM([SerialCheckCode])),
		LTRIM(RTRIM([SerialHighCode])),
		LTRIM(RTRIM([SerialLowCode])),
		LTRIM(RTRIM([EngineTypeCode])),
		LTRIM(RTRIM([EngineHighCode])),
		LTRIM(RTRIM([EngineLowCode])),
		LTRIM(RTRIM([TransmissiontypeCode])),
		LTRIM(RTRIM([TransmissionHighCode])),
		LTRIM(RTRIM([TransmissionLowCode])),
		LTRIM(RTRIM([ModelNameText])),
		LTRIM(RTRIM([HSCode]))
	FROM RJAAEPC_Catalog.dbo.tblModelMaster

	-- Section table
	DELETE FROM Section;
	INSERT INTO Section([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblSection
	WHERE [LanguageID] = 0

	-- Origin table
	DELETE FROM Origin;
	INSERT INTO Origin([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblOrigin
	WHERE [LanguageID] = 0

	-- ColorLabel table
	DELETE FROM ColorLabel;
	INSERT INTO ColorLabel([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblColorLabel
	WHERE [LanguageID] = 0

	-- ColorName table
	DELETE FROM ColorName;
	INSERT INTO ColorName([ID], [Description] , [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], LTRIM(RTRIM([Description])), [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblColorName
	WHERE [LanguageID] = 0

	-- NarrowSet_Section_rel table
	DELETE FROM NarrowSet_Section_rel;
	INSERT INTO NarrowSet_Section_rel([CatalogID], [NarrowSetSequenceID] , [SectionID])
	SELECT [CatalogID], [NarrowSetSequenceID] , [SectionID]
	FROM RJAAEPC_Catalog.dbo.tblNarrowSet_Section_rel

	-- Narrowset_rel table
	DELETE FROM Narrowset_rel;
	INSERT INTO Narrowset_rel(
		[CatalogID],
		[NarrowSetSequenceID],
		[ProductID],
		[GradeID],
		[DoorID],
		[YearID],
		[AreaID],
		[OriginID],
		[TransmissionID],
		[ColorLabelID],
		[ColorNameID],
		[IBFlag]
	)
	SELECT 
		[CatalogID],
		[NarrowSetSequenceID],
		[ProductID],
		[GradeID],
		[DoorID],
		[YearID],
		[AreaID],
		[OriginID],
		[TransmissionID],
		[ColorLabelID],
		[ColorNameID],
		[IBFlag]
	FROM RJAAEPC_Catalog.dbo.tblNarrowset_rel

	-- tblIllustrationGroup table
	DELETE FROM IllustrationGroup;
	INSERT INTO IllustrationGroup([ID], [CatalogID], [Code] , [Description], [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated])
	SELECT [ID], [CatalogID], [Code] , [Description], [EffectiveDate], [DateLastUpdated], [UserIDLastUpdated]
	FROM RJAAEPC_Catalog.dbo.tblIllustrationGroup
	WHERE [LanguageID] = 0

	-- NarrowSet_IllustrationGroup_rel table
	DELETE FROM NarrowSet_IllustrationGroup_rel;
	INSERT INTO NarrowSet_IllustrationGroup_rel([CatalogID], [NarrowSetSequenceID] , [SectionID], [IllustrationGroupID], [IllustrationGroupImageID], [SerialNumberFlag], [ChartFlag])
	SELECT [CatalogID], [NarrowSetSequenceID] , [SectionID], [IllustrationGroupID], [IllustrationGroupImageID], [SerialNumberFlag], [ChartFlag]
	FROM RJAAEPC_Catalog.dbo.tblNarrowSet_IllustrationGroup_rel
	WHERE [LanguageID] = 0

RETURN 0
