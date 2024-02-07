-- =============================================
-- Author:		Md Abul Kalam
-- Create date: 18 Sept, 2020
-- Description:	SP for migrating Part table data
-- =============================================
CREATE PROCEDURE [dbo].[MigratePartTableData]
AS
	SET NOCOUNT ON;
	-- Part table 
	DELETE FROM Part;
	INSERT INTO Part(
		[ID],
		[HondaCode],
		[PartNumber],
		[PartDescription],
		[PartControlCode],
		[SRACode],
		[MostForwardSupersession],
		[ForwardSupersession],
		[BackwardSupersession],
		[MultiOrderQuantity],
		[DealerNetPriceAmount],
		[SuggestedRetailPriceAmount],
		[CoreCostAmount],
		[PriceChangeFlag],
		[PartStatusCode],
		[VDFlag],
		[WholsaleCompFlag],
		[PartModificationCode],
		[NATABCQuantityCode],
		[PartSizeCode],
		[CRSShipCode],
		[CommonPartFlag],
		[Weight],
		[Height],
		[Length],
		[PartNumberStripped],
		[Width],
		[PartColorDescription],
		[PartColorName]
		)
	SELECT 
		[ID],
		LTRIM(RTRIM([HondaCode])),
		LTRIM(RTRIM([PartNumber])),
		LTRIM(RTRIM([PartDescription])),
		LTRIM(RTRIM([PartControlCode])),
		LTRIM(RTRIM([SRACode])),
		LTRIM(RTRIM([MostForwardSupersession])),
		LTRIM(RTRIM([ForwardSupersession])),
		LTRIM(RTRIM([BackwardSupersession])),
		[MultiOrderQuantity],
		[DealerNetPriceAmount],
		[SuggestedRetailPriceAmount],
		[CoreCostAmount],
		LTRIM(RTRIM([PriceChangeFlag])),
		LTRIM(RTRIM([PartStatusCode])),
		LTRIM(RTRIM([VDFlag])),
		LTRIM(RTRIM([WholsaleCompFlag])),
		LTRIM(RTRIM([PartModificationCode])),
		LTRIM(RTRIM([NATABCQuantityCode])),
		LTRIM(RTRIM([PartSizeCode])),
		LTRIM(RTRIM([CRSShipCode])),
		LTRIM(RTRIM([CommonPartFlag])),
		LTRIM(RTRIM([Weight])),
		LTRIM(RTRIM([Height])),
		LTRIM(RTRIM([Length])),
		LTRIM(RTRIM([PartNumberStripped])),
		LTRIM(RTRIM([Width])),
		LTRIM(RTRIM([PartColorDescription])),
		LTRIM(RTRIM([PartColorName]))
	FROM RJAAEPC_PartMaster.dbo.tblPart
	WHERE [LanguageID] = 0

RETURN 0
